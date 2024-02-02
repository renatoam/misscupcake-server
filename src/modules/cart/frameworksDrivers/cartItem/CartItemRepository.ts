import { Repository } from "@shared/domain/ports/Repository";
import { UniqueEntityID } from "@shared/domain/UniqueEntityID";
import { CartItem } from "src/modules/cartItem/domain/CartItemEntity";
import { Result } from "@shared/errors";

export interface CartItemRepository extends Repository {
  getItemsByCartId(cartId: UniqueEntityID): Promise<Result<CartItem[], Error>>
  saveMany(cartItems: CartItem[]): Promise<Result<any, Error>>
}
