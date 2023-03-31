import { ProductUseCase } from "@product/application/ProductUseCase";
import { Product } from "@product/domain/ProductEntity";
import { ProductProps } from "@product/domain/ProductProps";
import { ProductRepository } from "@product/infrastructure/ProductRepository";
import { Result } from "@shared/errors";
import { Filter } from "@shared/types/FilterTypes";

export class GetProductsUseCase implements ProductUseCase {
  private repository: ProductRepository

  constructor(repository: ProductRepository) {
    this.repository = repository
  }

  async run(filter?: Filter): Promise<Result<ProductProps.Root[], Error>> {
    const productsOrError = await this.repository.getAll(filter)

    if (productsOrError.isError()) {
      const error = productsOrError.getError()
      return Result.fail<typeof error>(error)
    }

    const rawProducts = productsOrError.getValue()
    const products = rawProducts.map(product => Product.create(product).props)
    
    return Result.success(products)
  }
}
