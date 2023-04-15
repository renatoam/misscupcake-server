
import { CustomerId } from "@cart/features/getActiveCart/GetActiveCartController";
import { HttpRequest, HttpResponse } from "@shared/types/httpTypes";

export interface CustomerParams {
  accountId?: string
  guestId?: string
  use?: 'guest' | 'account'
}

export interface ActiveCartStrategy {
  getActiveCart(
    request: HttpRequest<unknown, CustomerId, unknown>,
    response: HttpResponse
  ): Promise<HttpResponse>
}
