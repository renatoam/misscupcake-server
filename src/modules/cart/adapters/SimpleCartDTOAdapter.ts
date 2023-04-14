import { Cart } from "@cart/domain/CartEntity";
import { SimpleCartResponseDTO } from "@cart/features/addToCart/AddToCartProps";

export function simpleCartDTOAdapter(cart: Cart): SimpleCartResponseDTO {
  return {
    cartId: cart.id.toString(),
    accountId: cart.accountId.toString(),
    subtotal: cart.subtotal,
    total: cart.total,
    items: cart.items
  }
}
