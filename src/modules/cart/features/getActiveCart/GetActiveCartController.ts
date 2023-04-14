import { Controller } from "@base/Controller";
import { simpleCartItemDTOAdapter } from "@cart/adapters/SimpleCartDTOAdapter";
import { CartUseCase } from "@cart/application/CartUseCase";
import { Cart } from "@cart/domain/CartEntity";
import { SimpleCartResponseDTO } from "@cart/domain/CartProps";
import { CartRepository } from "@cart/infrastructure/CartRepository";
import { NotFoundError } from "@shared/errors";
import { errorResponseHandler } from "@shared/errors/ErrorHandler";
import { notFound, ok } from "@shared/helpers/http";
import { HttpRequest, HttpResponse } from "@shared/types/httpTypes";
import { AccountGuestActiveCartStrategy } from "./AccountGuestActiveCartStrategy";

export type CustomerId = { accountId?: string, guestId?: string, use?: 'guest' | 'account' }

export class GetActiveCartController implements Controller {
  private getActiveCartUseCase: CartUseCase<string, Cart>
  private repository: CartRepository
  
  constructor(
    repository: CartRepository,
    getActiveCartUseCase: CartUseCase<string, Cart>
  ) {
    this.repository = repository
    this.getActiveCartUseCase = getActiveCartUseCase
  }

  async handle(
    request: HttpRequest<unknown, CustomerId, unknown>,
    response: HttpResponse
  ): Promise<HttpResponse> {
    const { accountId, guestId, use } = request.query
    const errorHandler = errorResponseHandler(response)
    const accountGuestActiveCartStrategy = new AccountGuestActiveCartStrategy(this.getActiveCartUseCase)

    let activeGuestCart
    let activeAccountCart
    
    if (accountId && guestId) {
      const activeCartOrError = await accountGuestActiveCartStrategy
        .getActiveCart({ accountId, guestId, use })
      
      if (activeCartOrError.isError()) {
        return errorHandler(activeCartOrError.getError())
      }

      const successResponse = ok<SimpleCartResponseDTO>(activeCartOrError.getValue())
      return response.status(successResponse.statusCode).json(successResponse.body)
    }

    if (!accountId && guestId) {
      const guestCartsOrError = await this.repository.getCartsByCustomerId(guestId)

      if (guestCartsOrError.isError()) {
        return errorHandler(guestCartsOrError.getError())
      }

      activeGuestCart = guestCartsOrError.getValue().find(cart => cart.status === 'active')

      if (!activeGuestCart) {
        const notFoundResponse = notFound(
          new NotFoundError(Error('There is no active cart associated to this account.'))
        )

        return response.status(notFoundResponse.statusCode).json(notFoundResponse.body)
      }

      const successResponse = ok<SimpleCartResponseDTO>({
        cartId: activeGuestCart.id.toString(),
        accountId: guestId,
        subtotal: activeGuestCart.subtotal,
        total: activeGuestCart.total,
        items: activeGuestCart.items.map(item => simpleCartItemDTOAdapter(item))
      })

      return response.status(successResponse.statusCode).json(successResponse.body)
    }
    
    const accountCartsOrError = await this.repository.getCartsByCustomerId(accountId!)

    if (accountCartsOrError.isError()) {
      return errorHandler(accountCartsOrError.getError())
    }

    activeAccountCart = accountCartsOrError.getValue().find(cart => cart.status === 'active')

    if (!activeAccountCart) {
      const notFoundResponse = notFound(
        new NotFoundError(Error('There is no active cart associated to this account.'))
      )

      return response.status(notFoundResponse.statusCode).json(notFoundResponse.body)
    }

    const successResponse = ok<SimpleCartResponseDTO>({
      cartId: activeAccountCart.id.toString(),
      accountId: accountId!,
      subtotal: activeAccountCart.subtotal,
      total: activeAccountCart.total,
      items: activeAccountCart.items.map(item => simpleCartItemDTOAdapter(item))
    })

    return response.status(successResponse.statusCode).json(successResponse.body)
  }
}