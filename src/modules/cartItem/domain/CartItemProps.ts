export interface CartItemProps {
  productId: string
  cartId: string
  quantity: number
  name?: string
  image?: string
  unitPrice?: number // base price
  id?: string
  message?: string
  finalPrice?: number // price applying discounts that are direct on the product
  discountAmount?: number
  removed?: boolean
}

export interface CartItemByProduct {
  cartItemId: string
  productId: string
  cartId: string
  message: string
  quantity: number
}

export interface CartItemPersistence {
  id: string
  message: string
  quantity: number
  cart_id: string
  product_id: string
}
