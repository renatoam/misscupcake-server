export default class NotFoundError extends Error {
  constructor(error?: Error) {
    super('Not Found')
    this.name = 'NotFoundError'
    this.message = error?.message || 'The resource you are trying to access does not exist.'
    this.stack = error?.stack
    this.cause = error?.cause || 'Unknown'
  }
}
