import { UniqueEntityID } from "@shared/domain/UniqueEntityID";
import { supabase } from "@shared/frameworksDrivers/supabase";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { SupabaseCartItemRepository } from "./SupabaseCartItemRepository";
import { CustomCartItemMapper } from "./CustomCartItemMapper";

describe.only('CustomCartItemRepository', () => {
  const cartId = new UniqueEntityID()
  const accountId = new UniqueEntityID()
  const newCartItemId = new UniqueEntityID()

  beforeEach(async () => {
    const { error: accountError } = await supabase
      .from('account')
      .insert({ id: accountId.toValue() })
    
    if (accountError) {
      throw Error('Error on creating account.')
    }

    const { error: cartError } = await supabase
      .from('cart')
      .insert({ id: cartId.toValue(), account_id: accountId.toValue() })
      .select()
      .single()

    if (cartError) {
      throw Error('Error on creating cart.')
    }
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

    const cartItemMapper = new CustomCartItemMapper()
    const cartItemRepository = new SupabaseCartItemRepository(cartItemMapper)
    const persistenceCartItem = await cartItemRepository.getItemsByCartId(cartId)
    const item = persistenceCartItem.getValue()

    expect(item[0].cartItemId).toBe(cartItem?.id)
  })
})
