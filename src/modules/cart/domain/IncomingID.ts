import { UniqueEntityID } from "@base/UniqueEntityID";
import { Result } from "@shared/errors";
import { validate as isUuid } from "uuid";

export default class IncomingID {
  private value: UniqueEntityID

  constructor(id: string) {
    this.value = new UniqueEntityID(id)
  }

  static create(id?: string): Result<IncomingID, Error> {
    if (!id) {
      return Result.fail(Error('ID is required.'))
    }

    if (!isUuid(id)) {
      return Result.fail(Error('ID has invalid format.'))
    }

    return Result.success(new IncomingID(id))
  }

  getValue(): UniqueEntityID {
    return this.value
  }
}
