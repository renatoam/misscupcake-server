export default class ServerError extends Error {
  constructor(error?: Error) {
    super('Internal Server Error')
    this.name = 'ServerError'
    this.message = error?.message || 'Unexpected error: please, contact the support.'
    this.stack = error?.stack
    this.cause = error?.cause || 'Unknown'
  }
}
