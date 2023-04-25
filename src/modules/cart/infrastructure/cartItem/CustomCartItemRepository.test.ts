import { UniqueEntityID } from "@base/UniqueEntityID";
import { supabase } from "@database";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { CustomCartItemRepository } from "./CustomCartItemRepository";

describe.only('CustomCartItemRepository', () => {
  const cartId = new UniqueEntityID()
  const accountId = new UniqueEntityID()
  const newCartItemId = new UniqueEntityID()

  let mockCart = null

  beforeEach(async () => {
    const { error: accountError } = await supabase
      .from('account')
      .insert({ id: accountId.toValue() })
    
    if (accountError) {
      throw Error('Error on creating account.')
    }

    const { data: cart, error: cartError } = await supabase
      .from('cart')
      .insert({ id: cartId.toValue(), account_id: accountId.toValue() })
      .select()
      .single()

    if (cartError) {
      throw Error('Error on creating cart.')
    }

    mockCart = cart
  })

  afterEach(async () => {
    const { error: cartItemError } = await supabase
      .from('cart_item')
      .delete()
      .eq('id', newCartItemId.toValue())
    
    if (cartItemError) {
      throw Error('Error on deleting cart item.')
    }
    
    const { error: cartError } = await supabase
      .from('cart')
      .delete()
      .eq('id', cartId.toValue())
    
    if (cartError) {
      throw Error('Error on deleting cart.')
    }

    mockCart = null

    const { error: accountError } = await supabase
      .from('account')
      .delete()
      .eq('id', accountId.toValue())
    
    if (accountError) {
      throw Error('Error on deleting account.')
    }
  })

  it('should retrieve a cart item from cart_item table', async () => {
    const newCartItemId = new UniqueEntityID()
    const newCartitem = {
      product_id: 'b0d94dbd-1675-4fc5-bbb6-b13396d73fec',
      quantity: 10,
      cart_id: cartId.toValue(),
      id: newCartItemId.toValue()
    }
    const { data: cartItem, error: cartItemError } = await supabase
      .from('cart_item')
      .insert(newCartitem)
      .select()
      .single()

    if (cartItemError) {
      throw Error('Error on creating cart item.')
    }

    const cartItemRepository = new CustomCartItemRepository()
    const persistenceCartItem = await cartItemRepository.getByCartId(cartId)

    expect(persistenceCartItem.id).toBe(cartItem?.id)
  })
})
