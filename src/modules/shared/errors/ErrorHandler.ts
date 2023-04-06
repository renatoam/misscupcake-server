import { serverError, serviceUnavailable } from "@shared/helpers/http";
import { ErrorBody } from "@shared/types/errorTypes";
import { HttpRequest, HttpResponse } from "@shared/types/httpTypes";

export function errorHandler(
  error: Error,
  _request: HttpRequest,
  response: HttpResponse
): HttpResponse<ErrorBody> {
  const serverErrorResponse = serverError(error)
  const databaseErrorResponse = serviceUnavailable(error)

  switch (error.name) {
    case 'QueryError':
      console.error(`QueryError: ${error.message}`)
      return response.status(serverErrorResponse.statusCode).json(serverErrorResponse.body)
    case 'DatabaseError':
      console.error(`${error.name}: ${error.message}`)
      return response.status(databaseErrorResponse.statusCode).json(databaseErrorResponse.body)
    default:
      console.error(`${error.name}: ${error.message}`)
      return response.status(serverErrorResponse.statusCode).json(serverErrorResponse.body)
  }
}
