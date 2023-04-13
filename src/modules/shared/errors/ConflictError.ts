export default class ConflictError extends Error {
  constructor(error?: Error) {
    super('Conflict')
    this.name = 'ConflictError'
    this.message = error?.message || 'There is a conflict in your request.'
    this.stack = error?.stack
    this.cause = error?.cause || 'Unknown'
  }
}
