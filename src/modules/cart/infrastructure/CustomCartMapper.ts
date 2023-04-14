import { Adapter } from "@base/Mapper";
import { persistenceToDomainCartAdapter } from "@cart/adapters/CartToDomainAdapter";
import { Cart } from "@cart/domain/CartEntity";
import { CartPersistenceProps } from "@cart/domain/CartPersistenceProps";
import { Result } from "@shared/errors";
import { CartMapper } from "./CartMapper";

export class CustomCartMapper implements CartMapper {
  toDTO<Source, DTO>(source: Source, adapter: Adapter<Source, DTO>): Result<DTO, Error> {
    const adapteeCart = adapter(source)

    return Result.success(adapteeCart)
  }

  toDomain(raw: CartPersistenceProps): Result<Cart, Error> {
    const adapteeCart = persistenceToDomainCartAdapter(raw)
    const newProduct = Cart.create(adapteeCart)

    return Result.success(newProduct.getValue())
  }
  
  toPersistence(_domain: Cart): Result<CartPersistenceProps, Error> {
    throw new Error("Method not implemented.");
  }
}
