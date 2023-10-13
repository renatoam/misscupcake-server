import { Cart } from "@cart/domain/entities/CartEntity";
import { Adapter, Mapper } from "@shared/domain/ports/Mapper";
import { Result } from "@shared/errors";

export interface CartMapper<Persistence> extends Mapper<Cart> {
  toDomain(raw: Persistence): Result<Cart, Error>
  toDTO<Source, DTO>(source: Source, adapter: Adapter<Source, DTO>): Result<DTO, Error>
  toPersistence(domain: Cart): Result<Persistence, Error>
}
