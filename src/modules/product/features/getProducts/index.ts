import { CustomProductRepository } from "@product/infrastructure/CustomProductRepository"
import { HttpRequest, HttpResponse } from "@shared/types/httpTypes"
import { GetProductsController } from "./GetProductsController"
import { GetProductsUseCase } from "./GetProductsUseCase"

export const customProductRepository = new CustomProductRepository()
export const getProductsUseCase = new GetProductsUseCase(customProductRepository)
export const getProductsController = new GetProductsController(getProductsUseCase)

export const getProducts = (request: HttpRequest, response: HttpResponse) => {
  return getProductsController.handle(request, response)
}
