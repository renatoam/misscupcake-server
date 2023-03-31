import { ClientError, ForbiddenError, NotFoundError, ServerError, UnauthorizedError } from "@shared/errors"
import DatabaseError from "@shared/errors/DatabaseError"
import { HttpResponse } from "@shared/types/httpTypes"

export const ok = <T>(data: T): HttpResponse => ({
  statusCode: 200,
  body: data
})

export const created = <T>(data: T): HttpResponse => ({
  statusCode: 201,
  body: data
})

export const noContent = (): HttpResponse => ({
  statusCode: 204,
  body: null
})

export const badRequest = (error?: Error): HttpResponse => ({
  statusCode: 400,
  body: new ClientError(error)
})

export const unauthorized = (error?: Error): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError(error)
})

export const forbidden = (error?: Error): HttpResponse => ({
  statusCode: 403,
  body: new ForbiddenError(error)
})

export const notFound = (error?: Error): HttpResponse => ({
  statusCode: 404,
  body: new NotFoundError(error)
})

export const serverError = (error?: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error)
})

export const serviceUnavailable = (error?: Error): HttpResponse => ({
  statusCode: 503,
  body: new DatabaseError(error)
})
