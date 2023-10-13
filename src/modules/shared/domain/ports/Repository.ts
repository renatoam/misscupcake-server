export interface Repository {
  getAll(filter?: unknown): Promise<unknown>
  getById(id: string): Promise<unknown>
  save(data: unknown): Promise<unknown>
  delete(id: string): Promise<void>
}
