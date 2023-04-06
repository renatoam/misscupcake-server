export type CallbackError = (error?: Error) => void;
export type ErrorBody = {
  name: string
  message: string
  stack?: string
  cause?: unknown
}
