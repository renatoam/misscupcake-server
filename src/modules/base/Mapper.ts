import { Result } from "@shared/errors"

export type Adapter<Source, DTO> = (source: Source) => DTO

export interface Mapper<Persistence, Domain> {
  toDomain(raw: Persistence): Result<Domain, Error>
  toDTO<Source, DTO>(source: Source, adapter: Adapter<Source, DTO>): Result<DTO | DTO[], Error>
  toPersistence(domain: Domain): Result<Persistence, Error>
}
