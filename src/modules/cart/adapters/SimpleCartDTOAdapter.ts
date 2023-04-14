import { Cart } from "@cart/domain/CartEntity";
import { CartItem } from "@cart/domain/CartItemEntity";
import { SimpleCartItemResponse, SimpleCartResponseDTO } from "@cart/domain/CartProps";

export function simpleCartDTOAdapter(cart: Cart): SimpleCartResponseDTO {
  return {
    cartId: cart.id.toString(),
    accountId: cart.accountId.toString(),
    subtotal: cart.subtotal,
    total: cart.total,
    items: cart.items.map(item => simpleCartItemDTOAdapter(item))
  }
}

export function simpleCartItemDTOAdapter(cartItem: CartItem): SimpleCartItemResponse {
  return {
    id: cartItem.id.toString(),
    name: cartItem.name,
    image: cartItem.image,
    quantity: cartItem.quantity,
    subtotal: cartItem.subtotal,
    total: cartItem.total
  }
}
