import { simpleCartDTOAdapter } from "@cart/adapters/SimpleCartDTOAdapter";
import { ActiveCartStrategy, CustomerParams } from "@cart/application/ActiveCartStrategy";
import { CartUseCase } from "@cart/application/CartUseCase";
import { Cart } from "@cart/domain/CartEntity";
import { SimpleCartResponseDTO } from "@cart/domain/CartProps";
import { errorResponseHandler } from "@shared/errors/ErrorHandler";
import { ok } from "@shared/helpers/http";
import { HttpRequest, HttpResponse } from "@shared/types/httpTypes";
import { CustomerId } from "./GetActiveCartController";

export class GuestActiveCartStrategy implements ActiveCartStrategy {
  private getActiveCartUseCase: CartUseCase<string, Cart>

  constructor(getActiveCartUseCase: CartUseCase<string, Cart>) {
    this.getActiveCartUseCase = getActiveCartUseCase
  }

  async getActiveCart(
    request: HttpRequest<unknown, CustomerId, unknown>,
    response: HttpResponse
  ): Promise<HttpResponse> {
    const errorHandler = errorResponseHandler(response)
    const { guestId } = request.query as Required<CustomerParams>
    
    const guestCartsOrError = await this.getActiveCartUseCase.run(guestId)

    if (guestCartsOrError.isError()) {
      return errorHandler(guestCartsOrError.getError())
    }

    const activeGuestCart = guestCartsOrError.getValue()
    const activeCart = simpleCartDTOAdapter(activeGuestCart)
    const successResponse = ok<SimpleCartResponseDTO>(activeCart)
      return response.status(successResponse.statusCode).json(successResponse.body)
  }
}
