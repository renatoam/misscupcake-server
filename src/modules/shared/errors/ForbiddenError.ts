export default class ForbiddenError extends Error {
  constructor(error?: Error) {
    super('Forbidden')
    this.name = 'ForbiddenError'
    this.message = error?.message || 'You are not allowed to access this resource.'
    this.stack = error?.stack
    this.cause = error?.cause || 'Unknown'
  }
}
