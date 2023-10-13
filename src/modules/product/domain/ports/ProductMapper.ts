import { Product } from "@product/domain/ProductEntity";
import { Adapter, Mapper } from "@shared/domain/ports/Mapper";
import { Result } from "@shared/errors";

export interface ProductMapper<Persistence> extends Mapper<Product> {
  toDomain(raw: Persistence): Result<Product, Error>
  toDTO<Source, DTO>(source: Source, adapter: Adapter<Source, DTO>): Result<DTO | DTO[], Error>
  toPersistence(domain: Product): Result<Persistence, Error>
}
