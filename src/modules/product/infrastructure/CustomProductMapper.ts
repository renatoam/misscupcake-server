import { Adapter } from "@base/Mapper";
import { productToDomainAdapter } from "@product/adapters/ProductToDomainAdapter";
import { PersistenceProductProps } from "@product/domain/PersistenceProductProps";
import { Product } from "@product/domain/ProductEntity";
import { Result } from "@shared/errors";
import { ProductMapper } from "./ProductMapper";

export class CustomProductMapper implements ProductMapper {
  toDTO<Source, DTO>(source: Source, adapter: Adapter<Source, DTO>): Result<DTO | DTO[], Error> {
    const adapteeProduct = adapter(source)

    return Result.success(adapteeProduct)
  }
  toDomain(raw: PersistenceProductProps): Result<Product, Error> {
    const adapteeProduct = productToDomainAdapter(raw)
    const newProduct = Product.create(adapteeProduct)

    return Result.success(newProduct.getValue())
  }
  toPersistence(_domain: Product): Result<PersistenceProductProps, Error> {
    throw new Error("Method not implemented.");
  }
}