import { CartItemRequest } from "@cart/domain/CartProps"

// Add to Cart Use Case só chama o "save" se estiver criando carrinho
// caso contrário, chama o "update"

/**
 * Add products to an existent Cart
 * or create a new one
 */
export interface AddToCartRequestDTO {
  accountId: string
  products: CartItemRequest[]  
}
