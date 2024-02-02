import { CartUseCase } from "@cart/domain/ports/CartUseCase";
import { Cart } from "@cart/domain/entities/CartEntity";
import { CartRepository } from "@cart/domain/ports/CartRepository";
import { NotFoundError, Result, ServerError } from "@shared/errors";
import { CartItemRepository } from "@cart/frameworksDrivers/cartItem/CartItemRepository";
import { ProductRepository } from "@product/domain/ports/ProductRepository";
import { Product } from "@product/domain/ProductEntity";

export class GetActiveCartUseCase implements CartUseCase<string, Cart> {
  private cartRepository: CartRepository
  private cartItemRepository: CartItemRepository
  private productRepository: ProductRepository

  constructor(
    cartRepository: CartRepository,
    cartItemRepository: CartItemRepository,
    productRepository: ProductRepository
  ) {
    this.cartRepository = cartRepository
    this.cartItemRepository = cartItemRepository
    this.productRepository = productRepository
  }

  async execute(customerId: string): Promise<Result<Cart, Error>> {
    const activeCartOrError = await this.cartRepository.getActiveCart(customerId)

    if (activeCartOrError.isError()) {
      const notFoundError = new NotFoundError(activeCartOrError.getError())
      return Result.fail(notFoundError)
    }

    const activeCart = activeCartOrError.getValue()
    const cartItemsOrError = await this.cartItemRepository.getItemsByCartId(activeCart.id)

    if (cartItemsOrError.isError()) {
      const serverError = new ServerError(cartItemsOrError.getError())
      return Result.fail(serverError)
    }

    const productsIDs = cartItemsOrError.getValue().map(item => item.productId)
    const productsOrError = await this.productRepository.getProductsByIdInBulk(productsIDs)
    
    if (productsOrError.isError()) {
      const serverError = new ServerError(productsOrError.getError())
      return Result.fail(serverError)
    }

    const hashProducts = productsOrError.getValue()
      .reduce((acc, product) => {
        return {
          ...acc,
          [product.id]: product
        }
      }, {} as Record<string, Product>)
    
    const cartItems = cartItemsOrError.getValue()
      .map(item => {
        item.setUnitPrice(hashProducts[item.productId].unitPrice)
        return item
      })
    
    activeCart.setItems(cartItems)

    return Result.success(activeCart)
  }
}
