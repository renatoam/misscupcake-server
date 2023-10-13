import { BareItemDTO } from "@cart/domain/entities/CartProps"

export interface AddToCartRequestDTO {
  accountId: string
  products: BareItemDTO[]  
}
