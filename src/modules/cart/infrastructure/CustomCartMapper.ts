import { Adapter } from "@base/Mapper";
import { UniqueEntityID } from "@base/UniqueEntityID";
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
    const adapteeCartOrError = persistenceToDomainCartAdapter(raw)

    if (adapteeCartOrError.isError()) {
      return Result.fail(adapteeCartOrError.getError())
    }

    const { id, ...props } = adapteeCartOrError.getValue()
    const newCartOrError = Cart.create(props, new UniqueEntityID(id))

    if (newCartOrError.isError()) {
      return Result.fail(newCartOrError.getError())
    }

    const newCart = newCartOrError.getValue()

    return Result.success(newCart)
  }
  
  toPersistence(_domain: Cart): Result<CartPersistenceProps, Error> {
    throw new Error("Method not implemented.");
  }
}
