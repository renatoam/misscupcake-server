import { Adapter } from "@shared/domain/ports/Mapper";
import { CartItem } from "src/modules/cartItem/domain/CartItemEntity";
import { CartItemPersistence } from "src/modules/cartItem/domain/CartItemProps";
import { Result, ServerError } from "@shared/errors";
import { CartItemMapper } from "./CartItemMapper";

export class CustomCartItemMapper implements CartItemMapper<CartItemPersistence> {
  toDomain(raw: CartItemPersistence): Result<CartItem, Error> {
    const cartItemOrError = CartItem.create({
      id: raw.id,
      cartId: raw.cart_id,
      productId: raw.product_id,
      quantity: raw.quantity,
      message: raw.message
    })

    if (cartItemOrError.isError()) {
      return Result.fail(cartItemOrError.getError())
    }

    return cartItemOrError
  }
  
  toDTO<Source, DTO>(source: Source, adapter: Adapter<Source, DTO>): Result<DTO, Error> {
    throw new Error("Method not implemented.");
  }

  toPersistence(cartItem: CartItem): Result<CartItemPersistence, Error> {
    if (!cartItem.cartId) {
      return Result.fail(new ServerError(Error('Cart ID is required.')))
    }

    const cartItemPersistence: CartItemPersistence = {
      id: cartItem.id.toString(),
      message: cartItem.message ?? '',
      quantity: cartItem.quantity,
      cart_id: cartItem.cartId,
      product_id: cartItem.productId
    }

    return Result.success(cartItemPersistence)
  }
}
