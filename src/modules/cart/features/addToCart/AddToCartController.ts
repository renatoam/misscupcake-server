import { Controller } from "@base/Controller";
import { SimpleCartResponseDTO } from "@cart/domain/CartProps";
import IncomingID from "@cart/domain/IncomingID";
import { supabase } from "@database";
import { HttpRequest, HttpResponse } from "@shared/types/httpTypes";
import { v4 as uuid } from "uuid";
import { AddToCartRequestDTO } from "./AddToCartProps";

export class AddToCartController implements Controller {  
  async handle(
    request: HttpRequest,
    response: HttpResponse<SimpleCartResponseDTO>
  ): Promise<HttpResponse<SimpleCartResponseDTO>> {
    const { accountId, products } = request.body as AddToCartRequestDTO
    const accountIdOrError = IncomingID.create(accountId)
    const invalidProducts = !products || !products?.length
    const invalidFormat = !products?.every(product => {
      return Object.hasOwn(product, 'id') && Object.hasOwn(product, 'quantity')
    })
    const invalidProductId = products?.some(product => IncomingID.create(product.id).isError())

    if (accountIdOrError.isError() || invalidProducts || invalidFormat || invalidProductId) {
      return response.status(400).json()
    }

    let cart: any = null

    const { data: existentCart, error: existentCartError } = await supabase
      .from('cart')
      .select('*')
      .eq('account_id', accountId)
      .eq('status', 'active')
      .maybeSingle()

    if (existentCartError) {
      console.error(existentCartError)
      throw Error('Error on retrieving carts')
    }

    cart = existentCart

    if (!existentCart) {
      const { data: newCart, error } = await supabase
        .from('cart')
        .insert({
          status: 'active',
          account_id: accountId,
          id: uuid()
        })
        .select()
        .maybeSingle()
        
      if (error) return response.status(500).json(error.message)

      cart = newCart
    }

    const productsIds = products.reduce((acc, product) => {
      return {
        ...acc,
        [product.id]: product
      }
    }, {})

    const filtering = Object.keys(productsIds).reduce((acc, id, index) => {
      acc += `product_id.eq.${id}`
      acc += index >= Object.keys(productsIds).length - 1 ? '' : ','
      return acc
    }, '')
    const { data: existentCartItems, error: existentCartItemsError } = await supabase
      .from('cart_item')
      .select('*')
      .or(filtering)
    
    if (existentCartItemsError) {
      return response.status(500).json(existentCartItemsError.message)
    }

    const toUpdateCartItems = existentCartItems.map(item => ({
      product_id: item.product_id,
      quantity: productsIds[item.product_id].quantity,
      cart_id: cart?.id,
      id: item.id
    }))

    const existentIds = existentCartItems.map(item => item.product_id)
    const newCartItems = products
      .filter(product => !existentIds.includes(product.id))
      .map(product => ({
        product_id: product.id,
        quantity: product.quantity,
        cart_id: cart?.id,
        id: uuid()
      }))

    console.log({ newCartItems, toUpdateCartItems })
    const items = [...newCartItems, ...toUpdateCartItems]
    const { data: cartItems, error: cartItemsError } = await supabase
      .from('cart_item')
      .upsert(items)
      .select()

    if (cartItemsError) {
      const { error } = await supabase
      .from('cart')
      .delete()
      .eq('id', cart?.id)

      if (error) {
        return response.status(500).json({
          message: 'Cart item adding has failed and also we could not remove the created Cart.',
          details: error
        })
      }

      return response.status(500).json(cartItemsError.message)
    }

    const newCart: SimpleCartResponseDTO = {
      cartId: cart?.id,
      accountId,
      subtotal: 0,
      total: 0,
      items: cartItems ?? []
    }

    return response.status(200).json(newCart)
  }
}
