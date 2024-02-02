import { CustomCartMapper } from "@cart/frameworksDrivers/mappers/CustomCartMapper"
import { SupabaseCartRepository } from "@cart/frameworksDrivers/repositories/SupabaseCartRepository"
import { GetActiveCartUseCase } from "../useCases/GetActiveCartUseCase"
import { CustomProductMapper } from "@product/frameworksDrivers/mappers/CustomProductMapper"
import { SupabaseProductRepository } from "@product/frameworksDrivers/repositories/SupabaseProductRepository"
import { AddToCartUseCase } from "../useCases/addToCart/AddToCartUseCase"
import { AddToCartController } from "../interfaceAdapters/controllers/addToCart/AddToCartController"
import { HttpRequest, HttpResponse } from "@shared/types/httpTypes"
import { AddToCartRequestDTO } from "../interfaceAdapters/dtos/AddToCartDTO"
import { SupabaseCartItemRepository } from "@cart/frameworksDrivers/cartItem/SupabaseCartItemRepository"
import { CustomCartItemMapper } from "@cart/frameworksDrivers/cartItem/CustomCartItemMapper"

const cartMapper = new CustomCartMapper()
const cartItemMapper = new CustomCartItemMapper()
const productMapper = new CustomProductMapper()

const cartRepository = new SupabaseCartRepository(cartMapper)
const cartItemRepository = new SupabaseCartItemRepository(cartItemMapper)
const productRepository = new SupabaseProductRepository(productMapper)

const getActiveCartUseCase = new GetActiveCartUseCase(
  cartRepository,
  cartItemRepository,
  productRepository
)
const addToCartUseCase = new AddToCartUseCase(cartRepository, cartItemRepository, productRepository)

const addToCartController = new AddToCartController(getActiveCartUseCase, addToCartUseCase)

export const addToCart = (request: HttpRequest<AddToCartRequestDTO>, response: HttpResponse) => {
  return addToCartController.handle(request, response)
}
