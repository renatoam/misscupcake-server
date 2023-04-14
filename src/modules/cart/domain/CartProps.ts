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

export interface SimpleCartResponseDTO {
  cartId: string
  accountId: string
  subtotal: number
  total: number
  items: SimpleCartItemResponse[]  
}

export type SimpleCartItemResponse = {
  id: string
  name: string
  image: string
  quantity: number
  subtotal: number
  total: number
}
