export interface UseCase {
  run(filter?: unknown): Promise<unknown>
}
