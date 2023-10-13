import { UniqueEntityID } from "@shared/domain/UniqueEntityID";
import { CartItem } from "src/modules/cartItem/domain/CartItemEntity";
import { CartPersistenceProps } from "@cart/frameworksDrivers/mappers/CartPersistenceProps";
import { CartProps } from "@cart/domain/entities/CartProps";
import { Result } from "@shared/errors";

export function persistenceToDomainCartAdapter(raw: CartPersistenceProps): Result<CartProps, Error> {
  const itemsOrError = raw.items?.map(item => CartItem.create(item))
  const hasSomeError = itemsOrError?.find(item => item.isError())
  
  if (hasSomeError) {
    return Result.fail(hasSomeError.getError())
  }

  const items = itemsOrError?.map(item => item.getValue())
  const adaptedCart = {
    id: raw.id,
    accountId: new UniqueEntityID(raw.account_id),
    messages: raw.messages,
    status: raw.status,
    items
  }

  return Result.success(adaptedCart)
}
