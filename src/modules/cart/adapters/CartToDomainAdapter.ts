import { UniqueEntityID } from "@base/UniqueEntityID";
import { CartItem } from "@cart/domain/CartItemEntity";
import { CartPersistenceProps } from "@cart/domain/CartPersistenceProps";
import { CartProps } from "@cart/domain/CartProps";
import { Result } from "@shared/errors";

export function persistenceToDomainCartAdapter(raw: CartPersistenceProps): Result<CartProps, Error> {
  const itemsOrError = raw.items?.map(item => CartItem.create(item))
  const hasSomeError = itemsOrError?.find(item => item.isError())
  
  if (hasSomeError) {
    return Result.fail(hasSomeError.getError())
  }

  const items = itemsOrError?.map(item => item.getValue())
  const adapteeCart = {
    id: raw.id,
    accountId: new UniqueEntityID(raw.account_id),
    messages: raw.messages,
    status: raw.status,
    items
  }

  return Result.success(adapteeCart)
}
