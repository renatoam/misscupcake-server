import { Repository } from "@base/Repository";
import { UniqueEntityID } from "@base/UniqueEntityID";

export interface CartItemRepository extends Repository {
  getByCartId(cartId: UniqueEntityID): Promise<any>
}
