import { CartItem } from "src/modules/cartItem/domain/CartItemEntity"
import { BareItemDTO, SimpleCartResponseDTO } from "@cart/domain/entities/CartProps"
import { CartItemRepository } from "@cart/frameworksDrivers/cartItem/CartItemRepository"
import { GetProductsByIdInBulkUseCase } from "@product/useCases/GetProductsByIdInBulkUseCase"
import { errorResponseHandler } from "@shared/errors/ErrorHandler"
import { HttpRequest, HttpResponse } from "@shared/types/httpTypes"
import { GetActiveCartUseCase } from "../../useCases/GetActiveCartUseCase"
import GetCartItemsByCartIdUseCase from "../../useCases/GetCartItemsByCartIdUseCase"
import { UpdateCartRequestDTO } from "../dtos/UpdateCartDTO"
import { Product } from "@product/domain/ProductEntity"
import { ServerError } from "@shared/errors"
import { supabase } from "@shared/frameworksDrivers/supabase"
import { simpleCartItemDTOAdapter } from "@cart/interfaceAdapters/adapters/SimpleCartDTOAdapter"
import { ok } from "@shared/interfaceAdapters/httpResponseHandlers"

// WIP
export class UpdateCartController {
  private cartItemRepository: CartItemRepository
  private getCartItemsByCartIdUseCase: GetCartItemsByCartIdUseCase
  private getProductsByIdInBulkUseCase: GetProductsByIdInBulkUseCase
  private getActiveCartUseCase: GetActiveCartUseCase

  constructor(
    cartItemRepository: CartItemRepository,
    getCartItemsByCartIdUseCase: GetCartItemsByCartIdUseCase,
    getProductsByIdInBulkUseCase: GetProductsByIdInBulkUseCase,
    getActiveCartUseCase: GetActiveCartUseCase
  ) {
    this.cartItemRepository = cartItemRepository
    this.getCartItemsByCartIdUseCase = getCartItemsByCartIdUseCase
    this.getActiveCartUseCase = getActiveCartUseCase
    this.getProductsByIdInBulkUseCase = getProductsByIdInBulkUseCase
  }

  async handle(
    request: HttpRequest<UpdateCartRequestDTO>,
    response: HttpResponse<SimpleCartResponseDTO>
  ): Promise<HttpResponse> {
    const { accountId, cartItems } = request.body
    const errorHandler = errorResponseHandler(response)
    const activeCartOrError = await this.getActiveCartUseCase.execute(accountId)

    if (activeCartOrError.isError()) {
      return errorHandler(activeCartOrError.getError())
    }

    const activeCart = activeCartOrError.getValue()
    const existentCartItemsOrError = await this.getCartItemsByCartIdUseCase.execute(activeCart.id)

    if (existentCartItemsOrError.isError()) {
      return errorHandler(existentCartItemsOrError.getError())
    }

    const newCartItemsProductsIds = cartItems.map(item => item.productId)
    const newCartItemProductsOrError = await this.getProductsByIdInBulkUseCase.execute(newCartItemsProductsIds)

    if (newCartItemProductsOrError.isError()) {
      return errorHandler(newCartItemProductsOrError.getError())
    }

    const incomingProductsIds = cartItems.reduce((acc, cartItem) => {
      return {
        ...acc,
        [cartItem.id]: cartItem
      }
    }, {} as Record<string, BareItemDTO>)

    const existentCartItems = existentCartItemsOrError.getValue()
    const existentCartItemsIds = existentCartItems.map(item => item.id.toString())

    existentCartItems.forEach(item => item.setQuantity(incomingProductsIds[item.productId].quantity))

    const newCartItemProducts = newCartItemProductsOrError.getValue()
    const newCartItemProductsHash = newCartItemProducts.reduce((acc, product) => {
      return {
        ...acc,
        [product.id]: product
      }
    }, {} as Record<string, Product>)

    const newCartItemsOrError = cartItems
      .filter(cartItem => !existentCartItemsIds.includes(cartItem.id))
      .map(cartItem => CartItem.create({
        image: newCartItemProductsHash[cartItem.productId].images[0],
        name: newCartItemProductsHash[cartItem.productId].name,
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        unitPrice: newCartItemProductsHash[cartItem.productId].unitPrice,
        cartId: activeCart.id.toString(), 
      }))

    const invalidCartItem = newCartItemsOrError.find(item => item.isError())

    if (invalidCartItem) {
      return errorHandler(invalidCartItem.getError())
    }

    const newCartItems = newCartItemsOrError.map(item => item.getValue())

    const items = [...existentCartItems, ...newCartItems]
    const cartItemsOrError = await this.cartItemRepository.saveMany(items)

    if (cartItemsOrError.isError()) {
      const { error } = await supabase
      .from('cart')
      .delete()
      .eq('id', activeCart.id)

      if (error) {
        return errorHandler(
          new ServerError(
            Error('Cart item adding has failed and also we could not remove the created Cart.')
          )
        )
      }

      return errorHandler(cartItemsOrError.getError())
    }

    const updatedCart: SimpleCartResponseDTO = {
      cartId: activeCart.id.toString(),
      accountId,
      subtotal: 0,
      total: 0,
      items: items.map(item => simpleCartItemDTOAdapter(item))
    }

    const successResponse = ok<SimpleCartResponseDTO>(updatedCart)
    return response.status(successResponse.statusCode).json(successResponse.body)
  }
}