import { CustomCartMapper } from "@cart/infrastructure/CustomCartMapper";
import { CustomCartRepository } from "@cart/infrastructure/CustomCartRepository";
import { HttpRequest, HttpResponse } from "@shared/types/httpTypes";
import { CustomerId, GetActiveCartController } from "./GetActiveCartController";

export const cartMapper = new CustomCartMapper()
export const customCartRepository = new CustomCartRepository(cartMapper)
export const getCartByCustomerController = new GetActiveCartController(customCartRepository)

export const getActiveCart = (request: HttpRequest<unknown, CustomerId>, response: HttpResponse) => {
  return getCartByCustomerController.handle(request, response)
}
