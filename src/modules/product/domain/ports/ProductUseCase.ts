import { UseCase } from "@shared/domain/ports/UseCase";
import { Result } from "@shared/errors";

export interface ProductUseCase<RequestDTO, ResponseDTO> extends UseCase {
  execute(param?: RequestDTO): Promise<Result<ResponseDTO[], Error>>
}
