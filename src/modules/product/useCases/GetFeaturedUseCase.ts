import { ProductUseCase } from "@product/domain/ports/ProductUseCase";
import { Product } from "@product/domain/ProductEntity";
import { ProductRepository } from "@product/domain/ports/ProductRepository";
import { Result } from "@shared/errors";

export class GetFeaturedUseCase implements ProductUseCase<number, Product> {
  private repository: ProductRepository

  constructor(repository: ProductRepository) {
    this.repository = repository
  }

  async execute(limit?: number): Promise<Result<Product[], Error>> {
    const resultOrError = await this.repository.getFeatured(limit)

    if (resultOrError.isError()) {
      return Result.fail(resultOrError.getError())
    }

    return Result.success(resultOrError.getValue())
  }
}
