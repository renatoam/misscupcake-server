import { Identifier } from "@shared/domain/ports/Identifier";
import { isValidUUID } from "@shared/domain/services";
import { UniqueEntityID } from "@shared/domain/UniqueEntityID";
import { ClientError, Result } from "@shared/errors";

export default class IncomingID {
  private value: UniqueEntityID

  private constructor(id: string) {
    this.value = new UniqueEntityID(id)
  }

  static create(id?: string): Result<IncomingID, Error> {
    if (!id) {
      return Result.fail(new ClientError(Error('ID is required.')))
    }

    if (!isValidUUID(id)) {
      return Result.fail(new ClientError(Error('ID has invalid format.')))
    }

    return Result.success(new IncomingID(id))
  }

  public getValue(): number | string {
    return this.value.toValue()
  }

  public getString(): string {
    return this.value.toString()
  }

  public compare(id?: Identifier<string | number>): boolean {
    return this.value.equals(id)
  }
}
