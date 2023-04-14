import { simpleCartDTOAdapter } from "@cart/adapters/SimpleCartDTOAdapter";
import { ActiveCartStrategy, CustomerParams } from "@cart/application/ActiveCartStrategy";
import { CartUseCase } from "@cart/application/CartUseCase";
import { Cart } from "@cart/domain/CartEntity";
import { ConflictError, Result } from "@shared/errors";
import { SimpleCartResponseDTO } from "../addToCart/AddToCartProps";

export class AccountGuestActiveCartStrategy implements ActiveCartStrategy {
  private getActiveCartUseCase: CartUseCase<string, Cart>

  constructor(useCase: CartUseCase<string, Cart>) {
    this.getActiveCartUseCase = useCase
  }

  async getActiveCart(
    customerParams: CustomerParams
  ): Promise<Result<SimpleCartResponseDTO, Error>> {
    const { accountId, guestId, use } = customerParams
    
    const guestCartsOrError = await this.getActiveCartUseCase.run(guestId)
    const accountCartsOrError = await this.getActiveCartUseCase.run(accountId)

    if (guestCartsOrError.isError() && accountCartsOrError.isError()) {
      const error = guestCartsOrError.getError() || accountCartsOrError.getError()
      return Result.fail(error)
    }

    const activeGuestCart = guestCartsOrError.getValue()
    const activeAccountCart = accountCartsOrError.getValue()

    const isTheSameActiveCart = activeGuestCart.id.equals(activeAccountCart.id)
    const isDifferentActiveCart = !activeGuestCart.id.equals(activeAccountCart.id)

    const shouldReturnAccountCart = isTheSameActiveCart || use === 'account'

    if (shouldReturnAccountCart) {
      const activeCart = simpleCartDTOAdapter(activeAccountCart)
      return Result.success(activeCart)
    }

    if (isDifferentActiveCart && !use) {
      const conflictError = new ConflictError(
        Error('It seems there is already a cart created for your account. What you would like to do?')
      )
      return Result.fail(conflictError)
    }

    const activeCart = simpleCartDTOAdapter(activeGuestCart)
    return Result.success(activeCart)
  }
}
