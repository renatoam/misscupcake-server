import { UniqueEntityID } from "@shared/domain/UniqueEntityID";
import { CartItemPersistence } from "src/modules/cartItem/domain/CartItemProps";
import { supabase } from "@shared/frameworksDrivers/supabase";
import { QueryError, Result } from "@shared/errors";
import { CartItemRepository } from "./CartItemRepository";
import { CartItem } from "src/modules/cartItem/domain/CartItemEntity";
import { CartItemMapper } from "./CartItemMapper";

export class SupabaseCartItemRepository implements CartItemRepository {
  private cartItemMapper: CartItemMapper<CartItemPersistence>

  constructor(cartItemMapper: CartItemMapper<CartItemPersistence>) {
    this.cartItemMapper = cartItemMapper
  }

  async getItemsByCartId(cartId: UniqueEntityID): Promise<Result<CartItem[], Error>> {
    const { data, error } = await supabase
      .from('cart_item')
      .select('*')
      .eq('cart_id', cartId.toString())

    if (error) {
      const queryError = new QueryError(Error(error.message))
      return Result.fail<QueryError>(queryError)
    }

    const cartItemsResult = data.map(item => this.cartItemMapper.toDomain(item))
    const invalidCartItem = cartItemsResult.find(item => item.isError())

    if (invalidCartItem) {
      return Result.fail(invalidCartItem.getError())
    }

    const cartItems = cartItemsResult.map(item => item.getValue())

    return Result.success(cartItems)
  }

  async saveMany(cartItems: CartItem[]): Promise<Result<any, Error>> {
    const cartItemsResult =
      cartItems.map(cartItem => this.cartItemMapper.toPersistence(cartItem))
    const invalidCartItem = cartItemsResult.find(item => item.isError())
    
    if (invalidCartItem) {
      return Result.fail(invalidCartItem.getError())
    }

    const cartItemsPersistence = cartItemsResult.map(item => item.getValue())
    const { data, error } = await supabase
      .from('cart_item')
      .upsert(cartItemsPersistence)
      .select()

    if (error) {
      const queryError = new QueryError(Error(error.message))
      return Result.fail<QueryError>(queryError)
    }

    return Result.success(data)
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