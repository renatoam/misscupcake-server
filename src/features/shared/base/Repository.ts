export interface Repository<T> {
  getAll(filter?: unknown): Promise<T[]>
  getById(id: string): Promise<T>
  save(data: T): Promise<void>
  delete(id: string): Promise<void>
}
