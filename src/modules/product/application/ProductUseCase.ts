import { UseCase } from "@base/UseCase";
import { ProductProps } from "@product/domain/ProductProps";
import { Result } from "@shared/errors";
import { Filter } from "@shared/types/FilterTypes";

export interface ProductUseCase extends UseCase {
  run(filter?: Filter): Promise<Result<ProductProps.Root[], Error>>
}
