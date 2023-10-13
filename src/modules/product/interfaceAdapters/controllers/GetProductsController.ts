import { Controller } from "@shared/domain/ports/Controller";
import { getProductsAdapter } from "@product/interfaceAdapters/adapters/GetProductsAdapter";
import { ProductUseCase } from "@product/domain/ports/ProductUseCase";
import { Product } from "@product/domain/ProductEntity";
import { ProductMapper } from "@product/domain/ports/ProductMapper";
import { errorResponseHandler } from "@shared/errors/ErrorHandler";
import { createFilter } from "@shared/interfaceAdapters/filterServices";
import { ok } from "@shared/interfaceAdapters/httpResponseHandlers";
import { Filter, RawFilter } from "@shared/types/FilterTypes";
import { HttpRequest, HttpResponse } from "@shared/types/httpTypes";

export class GetProductsController<Persistence> implements Controller {
  private useCase: ProductUseCase<Filter, Product>
  private mapper: ProductMapper<Persistence>

  constructor(
    useCase: ProductUseCase<Filter, Product>,
    mapper: ProductMapper<Persistence>
  ) {
    this.useCase = useCase
    this.mapper = mapper
  }

  async handle(request: HttpRequest, response: HttpResponse): Promise<HttpResponse> {
    const rawFilter = request.query as RawFilter
    const filter = createFilter(rawFilter)
    const resultOrError = await this.useCase.execute(filter)
    const errorHandler = errorResponseHandler(response)

    if (resultOrError.isError()) {
      return errorHandler(resultOrError.getError())
    }

    const rawProducts = resultOrError.getValue()
    const adaptedProducts = rawProducts.map(product => {
      return this.mapper.toDTO(product, getProductsAdapter).getValue()
    })
    const successResponse = ok(adaptedProducts)
    return response.status(successResponse.statusCode).json(successResponse.body)
  }
}
