import { UseCase } from "@base/UseCase";
import { Result } from "@shared/errors";

export interface CartUseCase<RequestDTO = unknown, ResponseDTO = unknown> extends UseCase {
  run(requestDTO: RequestDTO): Promise<Result<ResponseDTO, Error>>
}
