import { CustomProductMapper } from "@product/infrastructure/CustomProductMapper"
import { CustomProductRepository } from "@product/infrastructure/CustomProductRepository"
import { HttpRequest, HttpResponse } from "@shared/types/httpTypes"
import { GetProductsController } from "./GetProductsController"
import { GetProductsUseCase } from "./GetProductsUseCase"

export const customProductMapper = new CustomProductMapper()
export const customProductRepository = new CustomProductRepository(customProductMapper)
export const getProductsUseCase = new GetProductsUseCase(customProductRepository)
export const getProductsController = new GetProductsController(getProductsUseCase, customProductMapper)

export const getProducts = (request: HttpRequest, response: HttpResponse) => {
  return getProductsController.handle(request, response)
}
