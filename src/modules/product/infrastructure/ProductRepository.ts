import { Repository } from "@base/Repository";
import { Product } from "@product/domain/ProductEntity";
import { Result } from "@shared/errors";
import { Filter } from "@shared/types/FilterTypes";

export interface ProductRepository extends Repository {
  getAll(filter?: Filter): Promise<Result<Product[], Error>>
  getFeatured(limit?: number): Promise<Result<Product[], Error>>
  getProductsByIdInBulk(ids: string[]): Promise<Result<Product[], Error>>
}
