import { validate as isUuid, v4 as uuid } from "uuid";
import { Identifier } from './Identifier';

export class UniqueEntityID extends Identifier<string | number>{
  constructor(id?: string | number) {
    if (id && !isUuid(id.toString())) {
      throw Error('Invalid ID format.')
    }
    super(id ? id : uuid())
  }
}
