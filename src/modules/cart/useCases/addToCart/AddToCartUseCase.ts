import { UniqueEntityID } from "@shared/domain/UniqueEntityID";
import { CartUseCase } from "@cart/domain/ports/CartUseCase";
import { Cart } from "@cart/domain/entities/CartEntity";
import { CartItem } from "src/modules/cartItem/domain/CartItemEntity";
import { BareItemDTO } from "@cart/domain/entities/CartProps";
import IncomingID from "@shared/domain/IncomingID";
import { SimpleProduct } from "@cart/domain/entities/SimpleProduct";
import { CartRepository } from "@cart/domain/ports/CartRepository";
import { CartItemRepository } from "@cart/frameworksDrivers/cartItem/CartItemRepository";
import { ProductRepository } from "@product/domain/ports/ProductRepository";
import { Result } from "@shared/errors";
import { AddToCartRequestDTO } from "../../interfaceAdapters/dtos/AddToCartDTO";

// TODO: encapsular os grupos de lógica em Domain/Application Services
export class AddToCartUseCase implements CartUseCase<AddToCartRequestDTO> {
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

  async execute(addToCartRequestDTO: AddToCartRequestDTO): Promise<Result<Cart, Error>> {
    const { accountId, products } = addToCartRequestDTO

    const accountIdOrError = IncomingID.create(accountId)
    const simpleProductsOrError = SimpleProduct.createMultiple(products)

    if (accountIdOrError.isError() || simpleProductsOrError.isError()) {
      return Result.fail(accountIdOrError.getError() || simpleProductsOrError.getError())
    }

    const productsIds = products.map(product => product.id)
    const productsOrError = await this.productRepository.getProductsByIdInBulk(productsIds)

    if (productsOrError.isError()) {
      return Result.fail(productsOrError.getError())
    }

    const hashIncomingProducts = products
      .reduce((acc, product) => ({
        ...acc, [product.id]: product
      }), {} as Record<string, BareItemDTO>)

    const retrievedProducts = productsOrError.getValue()
    const newCartItemsOrError = retrievedProducts.map(product => CartItem.create({
      name: product.name,
      image: product.images[0],
      quantity: hashIncomingProducts[product.id].quantity,
      discountAmount: product.discountAmount,
      unitPrice: product.unitPrice,
      finalPrice: product.calculatedPrice,
      productId: product.id
    }))

    const invalidCartItem = newCartItemsOrError.find(item => item.isError())

    if (invalidCartItem) {
      return Result.fail(invalidCartItem.getError())
    }

    const newCartItems = newCartItemsOrError.map(item => item.getValue())
    const newCartOrError = Cart.create({
      accountId: new UniqueEntityID(accountId),
      status: 'active',
      items: newCartItems,
    })

    if (newCartOrError.isError()) {
      return Result.fail(newCartOrError.getError())
    }

    const cartOrError = await this.cartRepository.save(newCartOrError.getValue())
    
    if (cartOrError.isError()) {
      return Result.fail(cartOrError.getError())
    }

    newCartItems.forEach(item => item.setCartId(cartOrError.getValue().id))
    const cartItemsOrError = await this.cartItemRepository.saveMany(newCartItems)

    if (cartItemsOrError.isError()) {
      return Result.fail(cartItemsOrError.getError())
    }
    
    return Result.success(cartOrError.getValue())
  }
}
