import { CustomCartMapper } from "@cart/frameworksDrivers/mappers/CustomCartMapper";
import { SupabaseCartRepository } from "@cart/frameworksDrivers/repositories/SupabaseCartRepository";
import { HttpRequest, HttpResponse } from "@shared/types/httpTypes";
import { CustomerId, GetActiveCartController } from "../interfaceAdapters/controllers/getActiveCart/GetActiveCartController";
import { GetActiveCartUseCase } from "../useCases/GetActiveCartUseCase";

export const cartMapper = new CustomCartMapper()
export const customCartRepository = new SupabaseCartRepository(cartMapper)
export const getActiveCartUseCase = new GetActiveCartUseCase(customCartRepository)
export const getActiveCartController = new GetActiveCartController(getActiveCartUseCase)

export const getActiveCart = (request: HttpRequest<unknown, CustomerId>, response: HttpResponse) => {
  return getActiveCartController.handle(request, response)
}
