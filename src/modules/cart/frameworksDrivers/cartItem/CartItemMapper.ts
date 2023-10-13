import { Adapter, Mapper } from "@shared/domain/ports/Mapper";
import { CartItem } from "src/modules/cartItem/domain/CartItemEntity";
import { Result } from "@shared/errors";

export interface CartItemMapper<Persistence> extends Mapper<CartItem> {
  toDomain(raw: Persistence): Result<CartItem, Error>
  toDTO<Source, DTO>(source: Source, adapter: Adapter<Source, DTO>): Result<DTO, Error>
  toPersistence(domain: CartItem): Result<Persistence, Error>
}
