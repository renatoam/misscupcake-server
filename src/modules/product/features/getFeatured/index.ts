import { CustomProductMapper } from "@product/infrastructure/CustomProductMapper";
import { CustomProductRepository } from "@product/infrastructure/CustomProductRepository";
import { HttpRequest, HttpResponse } from "@shared/types/httpTypes";
import { GetFeaturedController } from "./GetFeaturedController";
import { GetFeaturedUseCase } from "./GetFeaturedUseCase";

export const customProductMapper = new CustomProductMapper()
export const customProductRepository = new CustomProductRepository(customProductMapper)
export const getFeaturedUseCase = new GetFeaturedUseCase(customProductRepository)
export const getFeaturedController = new GetFeaturedController(getFeaturedUseCase, customProductMapper)

export const getFeatured = (request: HttpRequest, response: HttpResponse) => {
  return getFeaturedController.handle(request, response)
}
