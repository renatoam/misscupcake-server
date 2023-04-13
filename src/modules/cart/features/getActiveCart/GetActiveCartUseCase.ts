import { CartUseCase } from "@cart/application/CartUseCase";
import { Cart } from "@cart/domain/CartEntity";
import { CartRepository } from "@cart/infrastructure/CartRepository";
import { NotFoundError, Result } from "@shared/errors";

export class GetActiveCartUseCase implements CartUseCase<string, Cart> {
  private repository: CartRepository

  constructor(repository: CartRepository) {
    this.repository = repository
  }

  async run(customerId: string): Promise<Result<Cart, Error>> {
    const cartsOrError = await this.repository.getCartsByCustomerId(customerId)

    if (cartsOrError.isError()) {
      return Result.fail(cartsOrError.getError())
    }

    const carts = cartsOrError.getValue()
    const activeCart = carts.find(cart => cart.status === 'active')

    if (!activeCart) {
      const notFoundError = new NotFoundError(Error('There is no active cart for this ID.'))
      return Result.fail(notFoundError)
    }

    return Result.success(activeCart)
  }
}