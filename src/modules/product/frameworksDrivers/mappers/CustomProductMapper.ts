import { Adapter } from "@shared/domain/ports/Mapper";
import { productToDomainAdapter } from "@product/interfaceAdapters/adapters/ProductToDomainAdapter";
import { PersistenceProductProps } from "./PersistenceProductProps";
import { Product } from "@product/domain/ProductEntity";
import { Result } from "@shared/errors";
import { ProductMapper } from "../../domain/ports/ProductMapper";

export class CustomProductMapper implements ProductMapper<PersistenceProductProps> {
  toDTO<Source, DTO>(source: Source, adapter: Adapter<Source, DTO>): Result<DTO | DTO[], Error> {
    const adaptedProduct = adapter(source)

    return Result.success(adaptedProduct)
  }

  toDomain(raw: PersistenceProductProps): Result<Product, Error> {
    const adaptedProduct = productToDomainAdapter(raw)
    const newProduct = Product.create(adaptedProduct)

    return Result.success(newProduct.getValue())
  }

  toPersistence(_domain: Product): Result<PersistenceProductProps, Error> {
    throw new Error("Method not implemented.");
  }
}