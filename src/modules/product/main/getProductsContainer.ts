import { CustomProductMapper } from "@product/frameworksDrivers/mappers/CustomProductMapper"
import { SupabaseProductRepository } from "@product/frameworksDrivers/repositories/SupabaseProductRepository"
import { HttpRequest, HttpResponse } from "@shared/types/httpTypes"
import { GetProductsController } from "../interfaceAdapters/controllers/GetProductsController"
import { GetProductsUseCase } from "../useCases/GetProductsUseCase"

export const customProductMapper = new CustomProductMapper()
export const customProductRepository = new SupabaseProductRepository(customProductMapper)
export const getProductsUseCase = new GetProductsUseCase(customProductRepository)
export const getProductsController = new GetProductsController(getProductsUseCase, customProductMapper)

export const getProducts = (request: HttpRequest, response: HttpResponse) => {
  return getProductsController.handle(request, response)
}
