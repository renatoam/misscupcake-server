export default class DatabaseError extends Error {
  constructor(error?: Error) {
    super('Database')
    this.name = 'DatabaseError'
    this.message = error?.message || 'Error on connecting with the database.'
    this.stack = error?.stack
    this.cause = error?.cause || 'Unknown'
  }
}
