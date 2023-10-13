import { CustomProductMapper } from "@product/frameworksDrivers/mappers/CustomProductMapper";
import { SupabaseProductRepository } from "@product/frameworksDrivers/repositories/SupabaseProductRepository";
import { HttpRequest, HttpResponse } from "@shared/types/httpTypes";
import { GetFeaturedController } from "../interfaceAdapters/controllers/GetFeaturedController";
import { GetFeaturedUseCase } from "../useCases/GetFeaturedUseCase";

export const customProductMapper = new CustomProductMapper()
export const customProductRepository = new SupabaseProductRepository(customProductMapper)
export const getFeaturedUseCase = new GetFeaturedUseCase(customProductRepository)
export const getFeaturedController = new GetFeaturedController(getFeaturedUseCase, customProductMapper)

export const getFeatured = (request: HttpRequest, response: HttpResponse) => {
  return getFeaturedController.handle(request, response)
}