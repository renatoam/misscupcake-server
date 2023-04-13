import { badRequest, notFound, serverError, serviceUnavailable } from "@shared/helpers/http";
import { ErrorBody } from "@shared/types/errorTypes";
import { HttpResponse } from "@shared/types/httpTypes";

export function errorResponseHandler(
  response: HttpResponse
): (error: Error) => HttpResponse<ErrorBody> {
  return (error: Error): HttpResponse<ErrorBody> => {
    const badRequestResponse = badRequest(error)
    const notFoundErrorResponse = notFound(error)
    const serverErrorResponse = serverError(error)
    const databaseErrorResponse = serviceUnavailable(error)

    switch (error.name) {
      case 'ClientError':
        console.error(`${error.name}: ${error.message}`)
        return response
          .status(badRequestResponse.statusCode)
          .json(badRequestResponse.body)
      
      case 'NotFoundError':
        console.error(`${error.name}: ${error.message}`)
        return response
          .status(notFoundErrorResponse.statusCode)
          .json(notFoundErrorResponse.body)
      
      case 'DatabaseError':
        console.error(`${error.name}: ${error.message}`)
        return response
          .status(databaseErrorResponse.statusCode)
          .json(databaseErrorResponse.body)
      
      case 'QueryError':
      default:
        console.error(`${error.name}: ${error.message}`)
        return response
          .status(serverErrorResponse.statusCode)
          .json(serverErrorResponse.body)
    }
  }
}
