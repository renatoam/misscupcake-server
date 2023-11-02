import { BareItemDTO } from "./SimpleItemsDTO"

export interface AddToCartRequestDTO {
  accountId: string
  products: BareItemDTO[]  
}
