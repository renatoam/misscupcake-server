import { simpleCartDTOAdapter } from "@cart/interfaceAdapters/adapters/SimpleCartDTOAdapter";
import { SimpleCartResponseDTO } from "@cart/interfaceAdapters/dtos/SimpleCartDTO";
import { GetActiveCartUseCase } from "@cart/useCases/GetActiveCartUseCase";
import { Controller } from "@shared/domain/ports/Controller";
import { errorResponseHandler } from "@shared/errors/ErrorHandler";
import { ok } from "@shared/interfaceAdapters/httpResponseHandlers";
import { HttpRequest, HttpResponse } from "@shared/types/httpTypes";

export type CustomerId = { customerId: string }

export class GetActiveCartController implements Controller {
  private getActiveCartUseCase: GetActiveCartUseCase
  
  constructor(getActiveCartUseCase: GetActiveCartUseCase) {
    this.getActiveCartUseCase = getActiveCartUseCase
  }

  async handle(
    request: HttpRequest<unknown, CustomerId, unknown>,
    response: HttpResponse
  ): Promise<HttpResponse> {
    const errorHandler = errorResponseHandler(response)
    const { customerId } = request.query
    
    const customerCartOrError = await this.getActiveCartUseCase.execute(customerId)

    if (customerCartOrError.isError()) {
      const error = customerCartOrError.getError()
      return errorHandler(error)
    }

    const customerActiveCart = customerCartOrError.getValue()
    const activeCart = simpleCartDTOAdapter(customerActiveCart)
    const successResponse = ok<SimpleCartResponseDTO>(activeCart)
    return response.status(successResponse.statusCode).json(successResponse.body)
  }
}
