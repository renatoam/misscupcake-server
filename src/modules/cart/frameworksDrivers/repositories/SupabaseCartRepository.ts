import { Cart } from "@cart/domain/entities/CartEntity";
import { supabase } from "@shared/frameworksDrivers/supabase";
import { DatabaseError, NotFoundError, QueryError, Result } from "@shared/errors";
import { CartMapper } from "../../domain/ports/CartMapper";
import { CartRepository } from "../../domain/ports/CartRepository";
import { CartPersistenceProps } from "@cart/frameworksDrivers/mappers/CartPersistenceProps";

export class SupabaseCartRepository implements CartRepository {
  private mapper: CartMapper<CartPersistenceProps>

  constructor(mapper: CartMapper<CartPersistenceProps>) {
    this.mapper = mapper
  }

  // Why do I'm not using `maybeSingle()`? Because it returns an error when there is no cart,
  // instead of the empty (that I expected/prefer)
  async getActiveCart(customerId: string): Promise<Result<Cart, Error>> {
    try {
      const { data: result, error: cartError } = await supabase
        .from('cart')
        .select('*')
        .eq('account_id', customerId)
        .eq('status', 'active')

      if (cartError) {
        const queryError = new QueryError(Error(cartError.message))
        return Result.fail<QueryError>(queryError)
      }

      if (!result?.length) {
        return Result.fail(new NotFoundError(Error('No active cart was found.')))
      }

      const cart = result[0]
      const adaptedCartOrError = this.mapper.toDomain(cart)

      if (adaptedCartOrError.isError()) {
        return Result.fail(adaptedCartOrError.getError())
      }

      const adaptedCart = adaptedCartOrError.getValue()
      
      return Result.success(adaptedCart)
    } catch (error) {
      const databaseError = new DatabaseError(Error())
      return Result.fail<DatabaseError>(databaseError)
    }
  }

  async getCartsByCustomerId(customerId: string): Promise<Result<Cart[], Error>> {
    try {
      const { data: carts, error } = await supabase
        .from('cart')
        .select('*')
        .eq('account_id', customerId)

      if (error) {
        const queryError = new QueryError(Error(error.message))
        return Result.fail<QueryError>(queryError)
      }

      if (!carts.length) {
        return Result.fail(new NotFoundError(Error('No cart was found.')))
      }

      const adaptedCart = carts.map(cart => this.mapper.toDomain(cart).getValue())
      return Result.success(adaptedCart)
    } catch (error) {
      const databaseError = new DatabaseError(Error())
      return Result.fail<DatabaseError>(databaseError)
    }
  }
  
  async save(cart: Cart): Promise<Result<Cart, Error>> {
    try {
      const { data: newCart, error } = await supabase
      .from('cart')
      .insert({
        status: 'active',
        account_id: cart.accountId.toString(),
        id: cart.id.toString()
      })
      .select()
      .maybeSingle()

      if (error) {
        const queryError = new QueryError(Error(error.message))
        return Result.fail<QueryError>(queryError)
      }

      const adaptedCart = this.mapper.toDomain(newCart).getValue()
      return Result.success(adaptedCart)
    } catch (error) {
      const databaseError = new DatabaseError(Error('', { cause: 'Save Cart' }))
      return Result.fail<DatabaseError>(databaseError)
    }
  }
  
  getAll(filter?: unknown): Promise<unknown> {
    throw new Error("Method not implemented.");
  }
  getById(id: string): Promise<unknown> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}