export interface Result<T> {
  status: number
  data?: T
  error?: Error
}

export interface UseCase<T> {
  run(filter?: unknown): Promise<Result<T>>
}
