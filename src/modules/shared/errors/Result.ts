export default class Result<T, Error> {
  private readonly value?: T
  private readonly error?: Error

  constructor(value?: T, error?: Error) {
    this.value = value
    this.error = error
  }

  public static success<T>(value: T): Result<T, never> {
    return new Result(value)
  }

  public static fail<Error>(error: Error): Result<never, Error> {
    return new Result(undefined as never, error)
  }

  public isOk(): boolean {
    return this.error === undefined
  }

  public isError(): boolean {
    return this.error !== undefined
  }

  public getValue(): T {
    return this.value as T
  }

  public getError(): Error {
    return this.error as Error
  }
}
