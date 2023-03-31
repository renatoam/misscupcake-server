import ClientError from "../errors/ClientError"
import ForbiddenError from "../errors/ForbiddenError"
import ServerError from "../errors/ServerError"
import UnauthorizedError from "../errors/UnauthorizedError"
import { HttpResponse } from "../types/httpTypes"

export const ok = <T>(data: T): HttpResponse => ({
  statusCode: 200,
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

export const forbidden = (error?: Error): HttpResponse => ({
  statusCode: 403,
  body: new ForbiddenError(error)
})

export const unauthorized = (error?: Error): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError(error)
})

export const serverError = (error?: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error)
})
