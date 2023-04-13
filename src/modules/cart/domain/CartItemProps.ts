export type CartItemProps = {
  id: string
  name: string
  image: string
  quantity: number
  message?: string
  unitPrice: number
  subtotal: number
  total: number
  discountAmount?: number
  removed?: boolean
}
