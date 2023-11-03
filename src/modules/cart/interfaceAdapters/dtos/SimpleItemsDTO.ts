export type BareItemDTO = {
  id: string
  productId: string
  quantity: number
}

export type SimpleCartItemResponseDTO = {
  id: string
  name: string
  image: string
  quantity: number
  total: number
  unitPrice?: number
}
