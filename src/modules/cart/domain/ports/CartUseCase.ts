import { UseCase } from "@shared/domain/ports/UseCase";
import { Result } from "@shared/errors";

export interface CartUseCase<Input = unknown, Output = unknown> extends UseCase {
  execute(input: Input): Promise<Result<Output, Error>>
}
