export default class UnauthorizedError extends Error {
  constructor(error?: Error) {
    super('Unauthorized')
    this.name = 'UnauthorizedError'
    this.message = error?.message || 'Unauthorized. Please, check your credentials.'
    this.stack = error?.stack
    this.cause = error?.cause || 'Unknown'
  }
}
