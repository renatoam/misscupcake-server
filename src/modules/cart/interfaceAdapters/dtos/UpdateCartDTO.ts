import { BareItemDTO } from "./SimpleItemsDTO"

export interface UpdateCartRequestDTO {
  cartId: string
  cartItems: BareItemDTO[]  
}
