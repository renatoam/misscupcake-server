import { Controller } from "@shared/domain/ports/Controller";
import { simpleCartDTOAdapter } from "@cart/interfaceAdapters/adapters/SimpleCartDTOAdapter";
import IncomingID from "@shared/domain/IncomingID";
import { SimpleProduct } from "@cart/domain/entities/SimpleProduct";
import { ConflictError } from "@shared/errors";
import { errorResponseHandler } from "@shared/errors/ErrorHandler";
import { ok } from "@shared/interfaceAdapters/httpResponseHandlers";
import { HttpRequest, HttpResponse } from "@shared/types/httpTypes";
import { GetActiveCartUseCase } from "../../../useCases/GetActiveCartUseCase";
import { AddToCartRequestDTO } from "../../dtos/AddToCartDTO";
import { AddToCartUseCase } from "../../../useCases/addToCart/AddToCartUseCase";
import { SimpleCartResponseDTO } from "@cart/interfaceAdapters/dtos/SimpleCartDTO";

export class AddToCartController implements Controller {
  private getActiveCartUseCase: GetActiveCartUseCase
  private addToCartUseCase: AddToCartUseCase

  constructor(
    getActiveCartUseCase: GetActiveCartUseCase,
    addToCartUseCase: AddToCartUseCase
  ) {
    this.getActiveCartUseCase = getActiveCartUseCase
    this.addToCartUseCase = addToCartUseCase
  }

  async handle(
    request: HttpRequest<AddToCartRequestDTO>,
    response: HttpResponse<SimpleCartResponseDTO>
  ): Promise<HttpResponse> {
    const { accountId, products } = request.body
    const accountIdOrError = IncomingID.create(accountId)
    const productsOrError = SimpleProduct.createMultiple(products)
    const errorHandler = errorResponseHandler(response)

    if (accountIdOrError.isError() || productsOrError.isError()) {
      return response.status(400).json()
    }

    const activeCartOrError = await this.getActiveCartUseCase.execute(accountId)

    if (activeCartOrError.isOk()) {
      return errorHandler(new ConflictError(
        Error('There is already an active cart for this account.')
      ))
    }

    const newCartOrError = await this.addToCartUseCase.execute({ accountId, products })
  
    if (newCartOrError.isError()) {
      return errorHandler(newCartOrError.getError())
    }

    const newCart = newCartOrError.getValue()
    const simpleCart: SimpleCartResponseDTO = simpleCartDTOAdapter(newCart)

    const successResponse = ok<SimpleCartResponseDTO>(simpleCart)
    return response.status(successResponse.statusCode).json(successResponse.body)
  }
}
