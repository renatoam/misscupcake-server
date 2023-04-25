import { Repository } from "@base/Repository";
import { Cart } from "@cart/domain/CartEntity";
import { Result } from "@shared/errors";

export interface CartRepository extends Repository {
  getCartsByCustomerId(customerId: string): Promise<Result<Cart[], Error>>
  getActiveCart(customerId: string): Promise<Result<Cart, Error>>
}
