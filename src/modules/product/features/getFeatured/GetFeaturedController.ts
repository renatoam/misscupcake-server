import { Controller } from "@base/Controller";
import { getProductsAdapter } from "@product/adapters/GetProductsAdapter";
import { ProductUseCase } from "@product/application/ProductUseCase";
import { Product } from "@product/domain/ProductEntity";
import { ProductMapper } from "@product/infrastructure/ProductMapper";
import { errorResponseHandler } from "@shared/errors/ErrorHandler";
import { ok } from "@shared/helpers/http";
import { HttpRequest, HttpResponse } from "@shared/types/httpTypes";

export class GetFeaturedController implements Controller {
  private useCase: ProductUseCase<number, Product>
  private mapper: ProductMapper

  constructor(
    useCase: ProductUseCase<number, Product>,
    mapper: ProductMapper
  ) {
    this.useCase = useCase
    this.mapper = mapper
  }

  async handle(request: HttpRequest, response: HttpResponse): Promise<HttpResponse> {
    const { limit } = request.query as { limit: string }
    const resultOrError = await this.useCase.run(parseInt(limit))
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