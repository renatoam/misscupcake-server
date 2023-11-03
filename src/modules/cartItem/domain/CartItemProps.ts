export interface CartItemProps {
  id?: string
  productId: string
  cartId?: string
  name: string
  image: string
  message?: string
  unitPrice: number // base price
  finalPrice?: number // price applying discounts that are direct on the product
  quantity: number
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
