import { UseCase } from "@base/UseCase";
import { Result } from "@shared/errors";

export interface ProductUseCase<RequestDTO, ResponseDTO> extends UseCase {
  run(param?: RequestDTO): Promise<Result<ResponseDTO[], Error>>
}
