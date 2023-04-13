
```typescript
/**
 * DB > Repos: Domain
 * Repos > UseCase: DTO
 * 
 */

/**
 * Load the cart for that account
 * Check if there is already a Cart for that user
 * Send a prompt to user confirm if should keep old
 * or create a new one
 * 
 * This can happen when user already has a cart,
 * but created a new one as a guest user
 * 
 * Probably, this situation is gonna happen in Checkout
 */
interface LoadCartRequestDTO {
  accountId: string // probably, I don't need this since it's gonna use auth
  cartId: string
}

interface UpdateCartRequestDTO {
  cartId: string
  products: CartProductRequest[]  
}

interface DeleteProductRequestDTO {
  cartId: string
  productId: string
}

// essa interface serve pros 3 casos acima
// ela não é a CartProps
interface CartResponseDTO {
  messages: CartMessages[]
  products: CartItemResponse[]
  subtotal: number
  discountAmount: number
  total: number
}

// Remove all
interface DeleteCartRequestDTO {
  cartId: string  
}

// Our Story page
interface DistanceFromUsRequestDTO {
  // data for Google Maps API
}

interface DistanceFromUsResponseDTO {
  // data for Google Maps API
}
```
