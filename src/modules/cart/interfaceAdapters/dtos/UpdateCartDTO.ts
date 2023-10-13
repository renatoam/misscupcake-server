import { BareItemDTO } from "@cart/domain/entities/CartProps"

export interface UpdateCartRequestDTO {
  accountId: string
  cartItems: BareItemDTO[]  
}
