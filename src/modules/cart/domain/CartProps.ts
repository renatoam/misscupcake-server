import { CartItem } from "./CartItemEntity"

export interface CartProps {
  accountId?: string
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
