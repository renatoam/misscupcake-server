import { SimpleCartResponseDTO } from "@cart/features/addToCart/AddToCartProps";
import { Result } from "@shared/errors";

export interface CustomerParams {
  accountId: string
  guestId: string
  use?: 'guest' | 'account'
}

export interface ActiveCartStrategy {
  getActiveCart(customerParams: CustomerParams): Promise<Result<SimpleCartResponseDTO, Error>>
}
