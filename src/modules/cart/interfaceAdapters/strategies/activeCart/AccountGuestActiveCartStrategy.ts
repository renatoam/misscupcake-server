import { simpleCartDTOAdapter } from "@cart/interfaceAdapters/adapters/SimpleCartDTOAdapter";
import { ActiveCartStrategy, CustomerParams } from "@cart/domain/ports/ActiveCartStrategy";
import { CartUseCase } from "@cart/domain/ports/CartUseCase";
import { Cart } from "@cart/domain/entities/CartEntity";
import { SimpleCartResponseDTO } from "@cart/domain/entities/CartProps";
import { ConflictError } from "@shared/errors";
import { errorResponseHandler } from "@shared/errors/ErrorHandler";
import { ok } from "@shared/interfaceAdapters/httpResponseHandlers";
import { HttpRequest, HttpResponse } from "@shared/types/httpTypes";
import { CustomerId } from "../../controllers/getActiveCart/GetActiveCartController";

export class AccountGuestActiveCartStrategy implements ActiveCartStrategy {
  private getActiveCartUseCase: CartUseCase<string, Cart>

  constructor(useCase: CartUseCase<string, Cart>) {
    this.getActiveCartUseCase = useCase
  }

  async getActiveCart(
    request: HttpRequest<unknown, CustomerId, unknown>,
    response: HttpResponse
  ): Promise<HttpResponse> {
    const errorHandler = errorResponseHandler(response)
    const { accountId, guestId, use } = request.query as Required<CustomerParams>
    
    const guestCartsOrError = await this.getActiveCartUseCase.execute(guestId)
    const accountCartsOrError = await this.getActiveCartUseCase.execute(accountId)

    if (guestCartsOrError.isError() && accountCartsOrError.isError()) {
      const error = guestCartsOrError.getError() || accountCartsOrError.getError()
      return errorHandler(error)
    }

    const activeGuestCart = guestCartsOrError.getValue()
    const activeAccountCart = accountCartsOrError.getValue()

    const isTheSameActiveCart = activeGuestCart.id.equals(activeAccountCart.id)
    const isDifferentActiveCart = !activeGuestCart.id.equals(activeAccountCart.id)

    const shouldReturnAccountCart = isTheSameActiveCart || use === 'account'
    
    if (shouldReturnAccountCart) {
      const activeCart = simpleCartDTOAdapter(activeAccountCart)
      const successResponse = ok<SimpleCartResponseDTO>(activeCart)
      return response.status(successResponse.statusCode).json(successResponse.body)
    }

    if (isDifferentActiveCart && !use) {
      const conflictError = new ConflictError(
        Error('It seems there is already a cart created for your account. What you would like to do?')
      )
      return errorHandler(conflictError)
    }

    const activeCart = simpleCartDTOAdapter(activeGuestCart)
    const successResponse = ok<SimpleCartResponseDTO>(activeCart)
    return response.status(successResponse.statusCode).json(successResponse.body)
  }
}
