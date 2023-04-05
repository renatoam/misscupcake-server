import { ClientError, ForbiddenError, NotFoundError, ServerError, UnauthorizedError } from "@shared/errors"
import DatabaseError from "@shared/errors/DatabaseError"
import { HttpHelperResponse } from "@shared/types/httpTypes"

export const ok = <T>(data: T): HttpHelperResponse<T> => ({
  statusCode: 200,
  body: data
})

export const created = <T>(data: T): HttpHelperResponse<T> => ({
  statusCode: 201,
  body: data
})

export const noContent = (): HttpHelperResponse => ({
  statusCode: 204,
  body: null
})

export const badRequest = (error?: Error): HttpHelperResponse => ({
  statusCode: 400,
  body: new ClientError(error)
})

export const unauthorized = (error?: Error): HttpHelperResponse => ({
  statusCode: 401,
  body: new UnauthorizedError(error)
})

export const forbidden = (error?: Error): HttpHelperResponse => ({
  statusCode: 403,
  body: new ForbiddenError(error)
})

export const notFound = (error?: Error): HttpHelperResponse => ({
  statusCode: 404,
  body: new NotFoundError(error)
})

export const serverError = (error?: Error): HttpHelperResponse => ({
  statusCode: 500,
  body: new ServerError(error)
})

export const serviceUnavailable = (error?: Error): HttpHelperResponse => ({
  statusCode: 503,
  body: new DatabaseError(error)
})
