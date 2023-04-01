import { ProductUseCase } from "@product/application/ProductUseCase";
import { Product } from "@product/domain/ProductEntity";
import { ProductProps } from "@product/domain/ProductProps";
import { ProductRepository } from "@product/infrastructure/ProductRepository";
import { Result } from "@shared/errors";

export class GetFeaturedUseCase implements ProductUseCase {
  private repository: ProductRepository

  constructor(repository: ProductRepository) {
    this.repository = repository
  }

  async run(limit?: number): Promise<Result<ProductProps.Root[], Error>> {
    const resultOrError = await this.repository.getFeatured(limit)

    if (resultOrError.isError()) {
      return Result.fail(resultOrError.getError())
    }

    const rawProducts = resultOrError.getValue()
    const products = rawProducts.map(raw => Product.create(raw).props)

    return Result.success(products)
  }
}
