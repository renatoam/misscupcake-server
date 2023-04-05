import { Adapter, Mapper } from "@base/Mapper";
import { PersistenceProductProps } from "@product/domain/PersistenceProductProps";
import { Product } from "@product/domain/ProductEntity";
import { Result } from "@shared/errors";

export interface ProductMapper extends Mapper<
  PersistenceProductProps,
  Product
> {
  toDomain(raw: PersistenceProductProps): Result<Product, Error>
  toDTO<Source, DTO>(source: Source, adapter: Adapter<Source, DTO>): Result<DTO | DTO[], Error>
  toPersistence(domain: Product): Result<PersistenceProductProps, Error>
}
