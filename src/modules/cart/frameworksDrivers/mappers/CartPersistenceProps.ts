import { CartMessage } from "../../domain/entities/CartProps"

export interface CartPersistenceProps {
  id: string
  created_at: Date
  updated_at: Date
  account_id: string
  status: string
  messages: CartMessage[]
  items?: any[]
}
