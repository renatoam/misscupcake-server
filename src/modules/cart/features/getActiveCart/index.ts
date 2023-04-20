import { CustomCartMapper } from "@cart/infrastructure/CustomCartMapper";
import { CustomCartRepository } from "@cart/infrastructure/CustomCartRepository";
import { HttpRequest, HttpResponse } from "@shared/types/httpTypes";
import { CustomerId, GetActiveCartController } from "./GetActiveCartController";
import { GetActiveCartUseCase } from "./GetActiveCartUseCase";

export const cartMapper = new CustomCartMapper()
export const customCartRepository = new CustomCartRepository(cartMapper)
export const getActiveCartUseCase = new GetActiveCartUseCase(customCartRepository)
export const getActiveCartController = new GetActiveCartController(getActiveCartUseCase)

export const getActiveCart = (request: HttpRequest<unknown, CustomerId>, response: HttpResponse) => {
  return getActiveCartController.handle(request, response)
}
