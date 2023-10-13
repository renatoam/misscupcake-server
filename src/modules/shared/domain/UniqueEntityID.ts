import { Identifier } from './ports/Identifier';
import { randomUUID} from "crypto";
import { isValidUUID } from './services';

export class UniqueEntityID extends Identifier<string | number> {
  constructor(id?: string | number) {
    if (id && !isValidUUID(id.toString())) {
      throw Error('Invalid ID format.')
    }

    super(id ?? randomUUID())
  }
}
