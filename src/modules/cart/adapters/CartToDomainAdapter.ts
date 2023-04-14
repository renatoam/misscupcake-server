import { UniqueEntityID } from "@base/UniqueEntityID";
import { CartPersistenceProps } from "@cart/domain/CartPersistenceProps";
import { CartProps } from "@cart/domain/CartProps";

export function persistenceToDomainCartAdapter(raw: CartPersistenceProps): Omit<CartProps, 'items'> {
  return {
    id: raw.id,
    accountId: new UniqueEntityID(raw.account_id),
    messages: raw.messages,
    status: raw.status
  }
}
