import { simpleCartDTOAdapter } from "@cart/interfaceAdapters/adapters/SimpleCartDTOAdapter";
import { ActiveCartStrategy, CustomerParams } from "@cart/domain/ports/ActiveCartStrategy";
import { CartUseCase } from "@cart/domain/ports/CartUseCase";
import { Cart } from "@cart/domain/entities/CartEntity";
import { SimpleCartResponseDTO } from "@cart/domain/entities/CartProps";
import { errorResponseHandler } from "@shared/errors/ErrorHandler";
import { ok } from "@shared/interfaceAdapters/httpResponseHandlers";
import { HttpRequest, HttpResponse } from "@shared/types/httpTypes";
import { CustomerId } from "../../controllers/getActiveCart/GetActiveCartController";

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
    
    const guestCartsOrError = await this.getActiveCartUseCase.execute(guestId)

    if (guestCartsOrError.isError()) {
      return errorHandler(guestCartsOrError.getError())
    }

    const activeGuestCart = guestCartsOrError.getValue()
    const activeCart = simpleCartDTOAdapter(activeGuestCart)
    const successResponse = ok<SimpleCartResponseDTO>(activeCart)
      return response.status(successResponse.statusCode).json(successResponse.body)
  }
}
