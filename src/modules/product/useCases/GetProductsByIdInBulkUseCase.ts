import { UseCase } from "@shared/domain/ports/UseCase";
import { Product } from "@product/domain/ProductEntity";
import { ProductRepository } from "@product/domain/ports/ProductRepository";
import { Result } from "@shared/errors";

export class GetProductsByIdInBulkUseCase implements UseCase {
  private productRepository: ProductRepository

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository
  }

  async execute(ids: string[]): Promise<Result<Product[], Error>> {
    const productsOrError = await this.productRepository.getProductsByIdInBulk(ids)

    if (productsOrError.isError()) {
      return Result.fail(productsOrError.getError())
    }

    return Result.success(productsOrError.getValue())
  }
}