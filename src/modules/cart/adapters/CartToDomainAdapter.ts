import { CartPersistenceProps } from "@cart/domain/CartPersistenceProps";
import { CartProps } from "@cart/domain/CartProps";

export function cartToDomainAdapter(raw: CartPersistenceProps): Omit<CartProps, 'items'> {
  return {
    id: raw.id,
    accountId: raw.account_id,
    messages: raw.messages,
    status: raw.status
  }
}
