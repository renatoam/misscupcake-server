import { Controller } from "@base/Controller";
import { ProductUseCase } from "@product/application/ProductUseCase";
import { Product } from "@product/domain/ProductEntity";
import { ProductMapper } from "@product/infrastructure/ProductMapper";
import { errorHandler } from "@shared/errors/ErrorHandler";
import { createFilter } from "@shared/helpers/filterHelpers";
import { ok } from "@shared/helpers/http";
import { Filter, RawFilter } from "@shared/types/FilterTypes";
import { HttpRequest, HttpResponse } from "@shared/types/httpTypes";
import { getProductsAdapter } from "./GetProductsAdapter";

export class GetProductsController implements Controller {
  private useCase: ProductUseCase<Filter, Product>
  private mapper: ProductMapper

  constructor(
    useCase: ProductUseCase<Filter, Product>,
    mapper: ProductMapper
  ) {
    this.useCase = useCase
    this.mapper = mapper
  }

  async handle(request: HttpRequest, response: HttpResponse): Promise<HttpResponse> {
    const rawFilter = request.query as RawFilter
    const filter = createFilter(rawFilter)
    const resultOrError = await this.useCase.run(filter)

    if (resultOrError.isError()) {
      return errorHandler(resultOrError.getError(), request, response)
    }

    const rawProducts = resultOrError.getValue()
    const adapteeProducts = rawProducts.map(product => {
      return this.mapper.toDTO(product, getProductsAdapter).getValue()
    })
    const successResponse = ok(adapteeProducts)
    return response.status(successResponse.statusCode).json(successResponse.body)
  }
}
