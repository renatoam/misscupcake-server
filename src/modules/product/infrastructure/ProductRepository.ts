import { Repository } from "@base/Repository";
import { ProductProps } from "@product/domain/ProductProps";
import { Result } from "@shared/errors";
import { Filter } from "@shared/types/FilterTypes";

export interface ProductRepository extends Repository {
  getAll(filter?: Filter): Promise<Result<ProductProps.Root[], Error>>
  getFeatured(limit?: number): Promise<Result<ProductProps.Root[], Error>>
}
