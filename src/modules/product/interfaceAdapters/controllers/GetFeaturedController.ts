import { Controller } from "@shared/domain/ports/Controller";
import { getProductsAdapter } from "@product/interfaceAdapters/adapters/GetProductsAdapter";
import { ProductUseCase } from "@product/domain/ports/ProductUseCase";
import { Product } from "@product/domain/ProductEntity";
import { ProductMapper } from "@product/domain/ports/ProductMapper";
import { errorResponseHandler } from "@shared/errors/ErrorHandler";
import { ok } from "@shared/interfaceAdapters/httpResponseHandlers";
import { HttpRequest, HttpResponse } from "@shared/types/httpTypes";
import { PersistenceProductProps } from "@product/frameworksDrivers/mappers/PersistenceProductProps";

export class GetFeaturedController implements Controller {
  private useCase: ProductUseCase<number, Product>
  private mapper: ProductMapper<PersistenceProductProps>

  constructor(
    useCase: ProductUseCase<number, Product>,
    mapper: ProductMapper<PersistenceProductProps>
  ) {
    this.useCase = useCase
    this.mapper = mapper
  }

  async handle(request: HttpRequest, response: HttpResponse): Promise<HttpResponse> {
    const { limit } = request.query as { limit: string }
    const resultOrError = await this.useCase.execute(parseInt(limit))
    const errorHandler = errorResponseHandler(response)

    if (resultOrError.isError()) {
      return errorHandler(resultOrError.getError())
    }

    const rawProducts = resultOrError.getValue()
    const adapteeProducts = rawProducts.map(product => {
      return this.mapper.toDTO(product, getProductsAdapter).getValue()
    })
    const successResponse = ok(adapteeProducts)
    return response.status(successResponse.statusCode).json(successResponse.body)
  }
}