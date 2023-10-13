import { Adapter } from "@shared/domain/ports/Mapper";
import { UniqueEntityID } from "@shared/domain/UniqueEntityID";
import { persistenceToDomainCartAdapter } from "@cart/interfaceAdapters/adapters/CartToDomainAdapter";
import { Cart } from "@cart/domain/entities/CartEntity";
import { CartPersistenceProps } from "@cart/frameworksDrivers/mappers/CartPersistenceProps";
import { Result } from "@shared/errors";
import { CartMapper } from "../../domain/ports/CartMapper";

export class CustomCartMapper implements CartMapper<CartPersistenceProps> {
  toDTO<Source, DTO>(source: Source, adapter: Adapter<Source, DTO>): Result<DTO, Error> {
    const adaptedCart = adapter(source)

    return Result.success(adaptedCart)
  }

  toDomain(raw: CartPersistenceProps): Result<Cart, Error> {
    const adaptedCartOrError = persistenceToDomainCartAdapter(raw)

    if (adaptedCartOrError.isError()) {
      return Result.fail(adaptedCartOrError.getError())
    }

    const { id, ...props } = adaptedCartOrError.getValue()
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
