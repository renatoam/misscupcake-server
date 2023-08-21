import { CartUseCase } from "@cart/application/CartUseCase";
import { Cart } from "@cart/domain/CartEntity";
import { CartRepository } from "@cart/infrastructure/cart/CartRepository";
import { NotFoundError, Result } from "@shared/errors";

export class GetActiveCartUseCase implements CartUseCase<string, Cart> {
  private repository: CartRepository

  constructor(repository: CartRepository) {
    this.repository = repository
  }

  async execute(customerId: string): Promise<Result<Cart, Error>> {
    const activeCartOrError = await this.repository.getActiveCart(customerId)

    if (activeCartOrError.isError()) {
      const notFoundError = new NotFoundError(activeCartOrError.getError())
      return Result.fail(notFoundError)
    }

    return Result.success(activeCartOrError.getValue())
  }
}
