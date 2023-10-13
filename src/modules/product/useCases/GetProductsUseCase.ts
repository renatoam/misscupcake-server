import { ProductUseCase } from "@product/domain/ports/ProductUseCase";
import { Product } from "@product/domain/ProductEntity";
import { ProductRepository } from "@product/domain/ports/ProductRepository";
import { Result } from "@shared/errors";
import { Filter } from "@shared/types/FilterTypes";

export class GetProductsUseCase implements ProductUseCase<Filter, Product> {
  private repository: ProductRepository

  constructor(repository: ProductRepository) {
    this.repository = repository
  }

  async execute(filter?: Filter): Promise<Result<Product[], Error>> {
    const productsOrError = await this.repository.getAll(filter)

    if (productsOrError.isError()) {
      const error = productsOrError.getError()
      return Result.fail(error)
    }
    
    return Result.success(productsOrError.getValue())
  }
}
