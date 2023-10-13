import { Repository } from "@shared/domain/ports/Repository";
import { Cart } from "@cart/domain/entities/CartEntity";
import { Result } from "@shared/errors";

export interface CartRepository extends Repository {
  save(data: unknown): Promise<Result<Cart, Error>>
  getCartsByCustomerId(customerId: string): Promise<Result<Cart[], Error>>
  getActiveCart(customerId: string): Promise<Result<Cart, Error>>
}
