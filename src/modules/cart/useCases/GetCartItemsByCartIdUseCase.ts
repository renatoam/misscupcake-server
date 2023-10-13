import { CartUseCase } from "@cart/domain/ports/CartUseCase";
import { CartItem } from "src/modules/cartItem/domain/CartItemEntity";
import { CartItemRepository } from "@cart/frameworksDrivers/cartItem/CartItemRepository";
import { Product } from "@product/domain/ProductEntity";
import { ProductRepository } from "@product/domain/ports/ProductRepository";
import { UniqueEntityID } from "@shared/domain/UniqueEntityID";
import { Result } from "@shared/errors";

export default class GetCartItemsByCartIdUseCase implements CartUseCase {
  private cartItemRepository: CartItemRepository
  private productRepository: ProductRepository

  constructor(
    cartItemRepository: CartItemRepository,
    productRepository: ProductRepository
  ) {
    this.cartItemRepository = cartItemRepository
    this.productRepository = productRepository
  }

  async execute(cartId: UniqueEntityID): Promise<Result<CartItem[], Error>> {
    const cartItemsByProductsOrError = await this.cartItemRepository.getItemsByCartId(cartId)

    if (cartItemsByProductsOrError.isError()) {
      return Result.fail(cartItemsByProductsOrError.getError())
    }

    const cartItemsByProducts = cartItemsByProductsOrError.getValue()
    const productsIds = cartItemsByProducts.map(item => item.productId)
    const productsOrError = await this.productRepository.getProductsByIdInBulk(productsIds)

    if (productsOrError.isError()) {
      return Result.fail(productsOrError.getError())
    }

    const rawProductHash = productsOrError.getValue().reduce((acc, item) => {
      return {
        ...acc,
        [item.id]: item
      }
    }, {} as Record<string, Product>)

    const cartItemsOrError = cartItemsByProducts.map(item => {
      return CartItem.create({
        name: rawProductHash[item.productId].name,
        image: rawProductHash[item.productId].images[0],
        quantity: item.quantity,
        unitPrice: rawProductHash[item.productId].unitPrice,
        productId: item.productId,
        message: item.message,
        discountAmount: rawProductHash[item.productId].discountAmount,
        finalPrice: rawProductHash[item.productId].calculatedPrice,
      }, new UniqueEntityID(item.cartItemId))
    })

    const itemWithError = cartItemsOrError.find(item => item.isError())
    
    if (itemWithError) {
      return Result.fail(itemWithError.getError())
    }

    const cartItems = cartItemsOrError.map(item => item.getValue())

    return Result.success(cartItems)
  }
}
