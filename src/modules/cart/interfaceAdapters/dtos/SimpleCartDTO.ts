import { SimpleCartItemResponseDTO } from "./SimpleItemsDTO"

export interface SimpleCartResponseDTO {
  cartId: string
  accountId: string
  subtotal: number
  total: number
  items: SimpleCartItemResponseDTO[]  
}
