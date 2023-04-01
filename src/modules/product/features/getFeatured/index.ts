import { CustomProductRepository } from "@product/infrastructure/CustomProductRepository";
import { HttpRequest, HttpResponse } from "@shared/types/httpTypes";
import { GetFeaturedController } from "./GetFeaturedController";
import { GetFeaturedUseCase } from "./GetFeaturedUseCase";

const customProductRepository = new CustomProductRepository()
const getFeaturedUseCase = new GetFeaturedUseCase(customProductRepository)
const getFeaturedController = new GetFeaturedController(getFeaturedUseCase)

export const getFeatured = (request: HttpRequest, response: HttpResponse) => {
  return getFeaturedController.handle(request, response)
}
