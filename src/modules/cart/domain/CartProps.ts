import { UniqueEntityID } from "@base/UniqueEntityID"
import { CartItem } from "./CartItemEntity"

export interface CartProps {
  accountId: UniqueEntityID
  items?: CartItem[]
  messages?: CartMessage[]
  status: string
  id?: string
}

export type CartItemRequest = {
  id: string
  quantity: number
}

export type CartMessage = {
  title: string
  text: string
}
