export default class QueryError extends Error {
  constructor(error?: Error) {
    super('Database')
    this.name = 'QueryError'
    this.message = error?.message || 'Error on database query.'
    this.stack = error?.stack
    this.cause = error?.cause || 'Unknown'
  }
}
