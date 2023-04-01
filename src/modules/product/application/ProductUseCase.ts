import { UseCase } from "@base/UseCase";
import { ProductProps } from "@product/domain/ProductProps";
import { Result } from "@shared/errors";

export interface ProductUseCase extends UseCase {
  run(param?: unknown): Promise<Result<ProductProps.Root[], Error>>
}
