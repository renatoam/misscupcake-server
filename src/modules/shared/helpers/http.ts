import { ClientError, ForbiddenError, NotFoundError, ServerError, UnauthorizedError } from "@shared/errors"
import DatabaseError from "@shared/errors/DatabaseError"
import { ErrorBody } from "@shared/types/errorTypes"
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

export const badRequest = (error?: Error): HttpHelperResponse<ErrorBody> => {
  const customError = new ClientError(error)

  return {
    statusCode: 400,
    body: {
      ...customError,
      name: customError.name,
      message: customError.message,
    }
  }
}

export const unauthorized = (error?: Error): HttpHelperResponse<ErrorBody> => {
  const customError = new UnauthorizedError(error)

  return {
    statusCode: 401,
    body: {
      ...customError,
      name: customError.name,
      message: customError.message,
    }
  }
}

export const forbidden = (error?: Error): HttpHelperResponse<ErrorBody> => {
  const customError = new ForbiddenError(error)

  return {
    statusCode: 403,
    body: {
      ...customError,
      name: customError.name,
      message: customError.message,
    }
  }
}

export const notFound = (error?: Error): HttpHelperResponse<ErrorBody> => {
  const customError = new NotFoundError(error)

  return {
    statusCode: 404,
    body: {
      ...customError,
      name: customError.name,
      message: customError.message,
    }
  }
}

export const serverError = (error?: Error): HttpHelperResponse<ErrorBody> => {
  const customError = new ServerError(error)

  return {
    statusCode: 500,
    body: {
      ...customError,
      name: customError.name,
      message: customError.message,
    }
  }
}

export const serviceUnavailable = (error?: Error): HttpHelperResponse<ErrorBody> => {
  const customError = new DatabaseError(error)

  return {
    statusCode: 503,
    body: {
      ...customError,
      name: customError.name,
      message: customError.message,
    }
  }
}
