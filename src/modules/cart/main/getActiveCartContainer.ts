import { CustomCartMapper } from "@cart/frameworksDrivers/mappers/CustomCartMapper";
import { SupabaseCartRepository } from "@cart/frameworksDrivers/repositories/SupabaseCartRepository";
import { HttpRequest, HttpResponse } from "@shared/types/httpTypes";
import { CustomerId, GetActiveCartController } from "../interfaceAdapters/controllers/getActiveCart/GetActiveCartController";
import { GetActiveCartUseCase } from "../useCases/GetActiveCartUseCase";
import { SupabaseCartItemRepository } from "@cart/frameworksDrivers/cartItem/SupabaseCartItemRepository";
import { CustomCartItemMapper } from "@cart/frameworksDrivers/cartItem/CustomCartItemMapper";
import { CustomProductMapper } from "@product/frameworksDrivers/mappers/CustomProductMapper";
import { SupabaseProductRepository } from "@product/frameworksDrivers/repositories/SupabaseProductRepository";

export const cartMapper = new CustomCartMapper()
export const cartItemMapper = new CustomCartItemMapper()
export const productMapper = new CustomProductMapper()

export const customCartRepository = new SupabaseCartRepository(cartMapper)
export const customCartItemRepository = new SupabaseCartItemRepository(cartItemMapper)
export const customProductRepository = new SupabaseProductRepository(productMapper)

export const getActiveCartUseCase = new GetActiveCartUseCase(
  customCartRepository,
  customCartItemRepository,
  customProductRepository
)

export const getActiveCartController = new GetActiveCartController(getActiveCartUseCase)

export const getActiveCart = async (request: HttpRequest<unknown, CustomerId>, response: HttpResponse) => {
  return getActiveCartController.handle(request, response)
}
