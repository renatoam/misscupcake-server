export interface UseCase {
  execute(filter?: unknown): Promise<unknown>
}
