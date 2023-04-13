import { CustomerId } from "@cart/features/getActiveCart/GetActiveCartController";
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
  const { accountId, guestId } = request.query
  const errorHandler = errorResponseHandler(response)

  if (!accountId && !guestId) {
    const badRequestError = new ClientError(
      Error('At least one account ID is required (guest or account).')
    )
    return errorHandler(badRequestError)
  }

  if (!accountId && !isUuid(guestId?.toString() ?? '')) {
    const badRequestError = new ClientError(
      Error('The provided guest ID is invalid.')
    )
    return errorHandler(badRequestError)
  }

  next()
}
