import { Controller } from "@base/Controller";
import { ProductUseCase } from "@product/application/ProductUseCase";
import { createFilter } from "@shared/helpers/filterHelpers";
import { ok, serverError, serviceUnavailable } from "@shared/helpers/http";
import { RawFilter } from "@shared/types/FilterTypes";
import { HttpRequest, HttpResponse } from "@shared/types/httpTypes";

export class GetProductsController implements Controller {
  private useCase: ProductUseCase

  constructor(useCase: ProductUseCase) {
    this.useCase = useCase
  }

  async handle(request: HttpRequest, response: HttpResponse): Promise<HttpResponse> {
    const rawFilter = request.query as RawFilter
    const filter = createFilter(rawFilter)
    const resultOrError = await this.useCase.run(filter)

    if (resultOrError.isError()) {
      const error = resultOrError.getError()
      const serverErrorResponse = serverError(error)
      const databaseErrorResponse = serviceUnavailable(error)

      switch (error.name) {
        case 'QueryError':
          return response.status(serverErrorResponse.statusCode).json(serverErrorResponse.body)
        case 'DatabaseError':
          return response.status(databaseErrorResponse.statusCode).json(databaseErrorResponse.body)
        default:
          return response.status(serverErrorResponse.statusCode).json(serverErrorResponse.body)
      }
    }

    const successResponse = ok(resultOrError.getValue())
    return response.status(successResponse.statusCode).json(successResponse.body)
  }
}
