import { ProductUseCase } from "@product/application/ProductUseCase";
import { Product } from "@product/domain/ProductEntity";
import { ProductRepository } from "@product/infrastructure/ProductRepository";
import { Result } from "@shared/errors";
import { Filter } from "@shared/types/FilterTypes";

export class GetProductsUseCase implements ProductUseCase<Filter, Product> {
  private repository: ProductRepository

  constructor(repository: ProductRepository) {
    this.repository = repository
  }

  async run(filter?: Filter): Promise<Result<Product[], Error>> {
    const productsOrError = await this.repository.getAll(filter)

    if (productsOrError.isError()) {
      const error = productsOrError.getError()
      return Result.fail(error)
    }
    
    return Result.success(productsOrError.getValue())
  }
}
