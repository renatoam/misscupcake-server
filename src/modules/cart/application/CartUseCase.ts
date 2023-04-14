import { UseCase } from "@base/UseCase";
import { Result } from "@shared/errors";

export interface CartUseCase<Input = unknown, Output = unknown> extends UseCase {
  run(input: Input): Promise<Result<Output, Error>>
}
