import { Cart } from "@cart/domain/entities/CartEntity";
import { CartItem } from "src/modules/cartItem/domain/CartItemEntity";
import { SimpleCartResponseDTO } from "../dtos/SimpleCartDTO";
import { SimpleCartItemResponseDTO } from "../dtos/SimpleItemsDTO";

export function simpleCartDTOAdapter(cart: Cart): SimpleCartResponseDTO {
  return {
    cartId: cart.id.toString(),
    accountId: cart.accountId.toString(),
    subtotal: cart.subtotal,
    total: cart.total,
    items: cart.items.map(item => simpleCartItemDTOAdapter(item))
  }
}

export function simpleCartItemDTOAdapter(cartItem: CartItem): SimpleCartItemResponseDTO {
  return {
    id: cartItem.id.toString(),
    name: cartItem.name,
    image: cartItem.image,
    quantity: cartItem.quantity,
    total: cartItem.total()
  }
}
