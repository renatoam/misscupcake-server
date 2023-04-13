import { Adapter, Mapper } from "@base/Mapper";
import { Cart } from "@cart/domain/CartEntity";
import { CartPersistenceProps } from "@cart/domain/CartPersistenceProps";
import { Result } from "@shared/errors";

export interface CartMapper extends Mapper<
  CartPersistenceProps,
  Cart
> {
  toDomain(raw: CartPersistenceProps): Result<Cart, Error>
  toDTO<Source, DTO>(source: Source, adapter: Adapter<Source, DTO>): Result<DTO | DTO[], Error>
  toPersistence(domain: Cart): Result<CartPersistenceProps, Error>
}
