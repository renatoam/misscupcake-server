import { UniqueEntityID } from "@shared/domain/UniqueEntityID";
import { CartItemByProduct, CartItemPersistence } from "src/modules/cartItem/domain/CartItemProps";
import { supabase } from "@shared/frameworksDrivers/supabase";
import { QueryError, Result } from "@shared/errors";
import { CartItemRepository } from "./CartItemRepository";
import { CartItem } from "src/modules/cartItem/domain/CartItemEntity";
import { CartItemMapper } from "./CartItemMapper";

export class CustomCartItemRepository implements CartItemRepository {
  private cartItemMapper: CartItemMapper<CartItemPersistence>

  constructor(cartItemMapper: CartItemMapper<CartItemPersistence>) {
    this.cartItemMapper = cartItemMapper
  }

  async getItemsByCartId(cartId: UniqueEntityID): Promise<Result<CartItemByProduct[], Error>> {
    const { data, error } = await supabase
      .from('cart_item')
      .select('*')
      .eq('cart_id', cartId.toString())

    if (error) {
      const queryError = new QueryError(Error(error.message))
      return Result.fail<QueryError>(queryError)
    }

    const cartItem: CartItemByProduct[] = data.map(item => ({
      cartItemId: item.id,
      productId: item.product_id,
      cartId: item.cart_id,
      message: item.message,
      quantity: item.quantity
    }))
    
    return Result.success(cartItem)
  }

  async saveMany(cartItems: CartItem[]): Promise<Result<void, Error>> {
    const cartItemsResult =
      cartItems.map(cartItem => this.cartItemMapper.toPersistence(cartItem))
    const invalidCartItem = cartItemsResult.find(item => item.isError())
    
    if (invalidCartItem) {
      return Result.fail(invalidCartItem.getError())
    }

    const cartItemsPersistence = cartItemsResult.map(item => item.getValue())
    const { error } = await supabase
      .from('cart_item')
      .upsert(cartItemsPersistence)

    if (error) {
      const queryError = new QueryError(Error(error.message))
      return Result.fail<QueryError>(queryError)
    }

    return Result.success(undefined)
  }
  
  getAll(filter?: unknown): Promise<unknown> {
    throw new Error("Method not implemented.");
  }
  getById(id: string): Promise<unknown> {
    throw new Error("Method not implemented.");
  }
  save(data: unknown): Promise<void> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}