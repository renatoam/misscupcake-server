import { Controller } from "@base/Controller";
import { CartRepository } from "@cart/infrastructure/CartRepository";
import { ConflictError, NotFoundError } from "@shared/errors";
import { errorResponseHandler } from "@shared/errors/ErrorHandler";
import { conflict, notFound, ok } from "@shared/helpers/http";
import { HttpRequest, HttpResponse } from "@shared/types/httpTypes";
import { SimpleCartResponseDTO } from "../addToCart/AddToCartProps";

export type CustomerId = { accountId?: string, guestId?: string, use?: 'guest' | 'account' }

export class GetActiveCartController implements Controller {
  // private getByCustomerUseCase: CartUseCase<string, Cart>

  // constructor(getByCustomerUseCase: CartUseCase<string, Cart>) {
  //   this.getByCustomerUseCase = getByCustomerUseCase
  // }

  private repository: CartRepository
  constructor(repository: CartRepository) {
    this.repository = repository
  }

  async handle(
    request: HttpRequest<unknown, CustomerId, unknown>,
    response: HttpResponse
  ): Promise<HttpResponse> {
    const { accountId, guestId, use } = request.query
    const errorHandler = errorResponseHandler(response)

    let activeGuestCart
    let activeAccountCart
    
    if (accountId && guestId) {

      const guestCartsOrError = await this.repository.getCartsByCustomerId(guestId)
      const accountCartsOrError = await this.repository.getCartsByCustomerId(accountId)

      if (guestCartsOrError.isError()) {
        return errorHandler(guestCartsOrError.getError())
      }
      
      if (accountCartsOrError.isError()) {
        return errorHandler(accountCartsOrError.getError())
      }

      // this filtering should live in use case
      activeGuestCart = guestCartsOrError.getValue().find(cart => cart.status === 'active')
      activeAccountCart = accountCartsOrError.getValue().find(cart => cart.status === 'active')

      // send those error to the error handler
      if (!activeGuestCart && !activeAccountCart) {
        const notFoundResponse = notFound(
          new NotFoundError(Error('There is no active cart associated to this account.'))
        )
        return response.status(notFoundResponse.statusCode).json(notFoundResponse.body)
      }

      if (activeGuestCart && activeAccountCart) {
        if (activeGuestCart.id === activeAccountCart.id) {
          // use an adapter here
          const successResponse = ok<SimpleCartResponseDTO>({
            cartId: activeAccountCart.id.toString(),
            accountId: accountId,
            subtotal: activeAccountCart.subtotal,
            total: activeAccountCart.total,
            items: activeAccountCart.items
          })

          return response.status(successResponse.statusCode).json(successResponse.body)
        }

        if (activeGuestCart.id !== activeAccountCart.id) {
          if (use === 'guest') {
            // use an adapter here
            const successResponse = ok<SimpleCartResponseDTO>({
              cartId: activeGuestCart.id.toString(),
              accountId: guestId,
              subtotal: activeGuestCart.subtotal,
              total: activeGuestCart.total,
              items: activeGuestCart.items
            })

            return response.status(successResponse.statusCode).json(successResponse.body)
          }
          
          if (use === 'account') {
            // use an adapter here
            const successResponse = ok<SimpleCartResponseDTO>({
              cartId: activeAccountCart.id.toString(),
              accountId: accountId,
              subtotal: activeAccountCart.subtotal,
              total: activeAccountCart.total,
              items: activeAccountCart.items
            })

            return response.status(successResponse.statusCode).json(successResponse.body)
          }

          const conflictResponse = conflict(
            new ConflictError(Error('It seems there is already a cart created for your account. What you would like to do?'))
          )

          return response.status(conflictResponse.statusCode).json(conflictResponse.body)
        }
      }
    }

    // temp: user should decide whether guest or account
    const newCart: SimpleCartResponseDTO = {
      cartId: activeAccountCart?.id.toString() || activeGuestCart?.id.toString() || '1123',
      accountId: 'map account id in cart entity',
      subtotal: 0,
      total: 0,
      items: []
    }
    
    return response.status(200).json(newCart)
  }
}