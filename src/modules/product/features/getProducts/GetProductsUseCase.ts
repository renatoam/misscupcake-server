import { Result, UseCase } from "@base/UseCase";
import { ProductProps } from "@product/domain/ProductProps";
import { ProductRepository } from "@product/infrastructure/ProductRepository";
import { Filter } from "@shared/types/FilterTypes";

export class GetProductsUseCase implements UseCase<ProductProps.Root[]> {
  private repository: ProductRepository

  constructor(repository: ProductRepository) {
    this.repository = repository
  }

  async run(filter?: Filter): Promise<Result<ProductProps.Root[]>> {
    try {
      const result = await this.repository.getAll(filter)
      
      return {
        status: 200,
        data: result
      }
    } catch (err) {
      const error = err as Error
      
      return {
        status: 400,
        error
      }
    }

  }
}