import { Controller } from "@base/Controller";
import { SimpleCartResponseDTO } from "@cart/domain/CartProps";
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
    const { data: cart, error } = await supabase
      .from('cart')
      .insert({
        status: 'active',
        account_id: accountId,
        id: 'b8559b13-4481-4eb8-8651-97cecf7e57a4'
      })
      .select()

    if (error) return response.status(500).json(error.message)
    
    const items = products.map(product => ({
      product_id: product.id,
      quantity: product.quantity,
      cart_id: cart?.[0].id,
      id: uuid()
    }))
    const { data: cartItems, error: cartItemsError } = await supabase
      .from('cart_item')
      .insert(items)

    if (cartItemsError) {
      const { error } = await supabase
      .from('cart')
      .delete()
      .eq('id', 'b8559b13-4481-4eb8-8651-97cecf7e57a4')

      if (error) {
        return response.status(500).json({
          message: 'Cart item adding has failed and also we could not remove the created Cart.',
          details: error
        })
      }

      return response.status(500).json(cartItemsError.message)
    }

    const newCart: SimpleCartResponseDTO = {
      cartId: cart[0].id,
      accountId,
      subtotal: 0,
      total: 0,
      items: cartItems ?? []
    }

    return response.status(200).json(newCart)
  }
}
