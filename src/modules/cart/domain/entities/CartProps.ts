import { UniqueEntityID } from "@shared/domain/UniqueEntityID"
import { CartItem } from "../../../cartItem/domain/CartItemEntity"

export interface CartProps {
  accountId: UniqueEntityID
  items?: CartItem[]
  messages?: CartMessage[]
  status: string
  id?: string
}

export type CartMessage = {
  title: string
  text: string
}
