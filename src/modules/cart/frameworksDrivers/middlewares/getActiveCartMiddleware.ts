import { CustomerId } from "@cart/interfaceAdapters/controllers/getActiveCart/GetActiveCartController";
import { ClientError } from "@shared/errors";
import { errorResponseHandler } from "@shared/errors/ErrorHandler";
import { HttpRequest, HttpResponse } from "@shared/types/httpTypes";
import { NextFunction } from "express";
import { validate as isUuid } from "uuid";

export function validateCustomerId(
  request: HttpRequest<unknown, CustomerId, unknown>,
  response: HttpResponse,
  next: NextFunction
) {
  const { customerId } = request.query
  const errorHandler = errorResponseHandler(response)

  if (!customerId) {
    const badRequestError = new ClientError(
      Error('Customer ID is required.')
    )
    return errorHandler(badRequestError)
  }

  if (!isUuid(customerId?.toString() ?? '')) {
    const badRequestError = new ClientError(
      Error('The provided customer ID has invalid format.')
    )
    return errorHandler(badRequestError)
  }

  next()
}
