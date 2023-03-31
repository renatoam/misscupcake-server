export default class ClientError extends Error {
  constructor(error?: Error) {
    super('Client Error')
    this.name = 'ClientError'
    this.message = error?.message || 'There is something wrong with your request.'
    this.stack = error?.stack
    this.cause = error?.cause || 'Unknown'
  }
}
