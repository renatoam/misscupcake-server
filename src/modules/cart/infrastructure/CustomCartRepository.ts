import { Cart } from "@cart/domain/CartEntity";
import { supabase } from "@database";
import { DatabaseError, NotFoundError, QueryError, Result } from "@shared/errors";
import { CartMapper } from "./CartMapper";
import { CartRepository } from "./CartRepository";

export class CustomCartRepository implements CartRepository {
  private mapper: CartMapper

  constructor(mapper: CartMapper) {
    this.mapper = mapper
  }

  async getActiveCart(customerId: string): Promise<Result<Cart, Error>> {
    try {
      const { data: cart, error } = await supabase
        .from('cart')
        .select('*')
        .eq('account_id', customerId)
        .eq('status', 'active')
        .maybeSingle()

      if (error) {
        const queryError = new QueryError(Error(error.message))
        return Result.fail<QueryError>(queryError)
      }

      if (!cart.length) {
        return Result.fail(new NotFoundError(Error('No active cart was found.')))
      }

      const adapteeCart = this.mapper.toDomain(cart).getValue()
      return Result.success(adapteeCart)
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

      const adapteeCart = carts.map(cart => this.mapper.toDomain(cart).getValue())
      return Result.success(adapteeCart)
    } catch (error) {
      const databaseError = new DatabaseError(Error())
      return Result.fail<DatabaseError>(databaseError)
    }
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