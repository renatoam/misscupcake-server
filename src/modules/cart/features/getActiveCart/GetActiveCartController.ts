import { Controller } from "@base/Controller";
import { CartUseCase } from "@cart/application/CartUseCase";
import { Cart } from "@cart/domain/CartEntity";
import { HttpRequest, HttpResponse } from "@shared/types/httpTypes";
import { AccountActiveCartStrategy } from "./AccountActiveCartStrategy";
import { AccountGuestActiveCartStrategy } from "./AccountGuestActiveCartStrategy";
import { GuestActiveCartStrategy } from "./GuestActiveCartStrategy";

export type CustomerId = { accountId?: string, guestId?: string, use?: 'guest' | 'account' }

export class GetActiveCartController implements Controller {
  private getActiveCartUseCase: CartUseCase<string, Cart>
  
  constructor(getActiveCartUseCase: CartUseCase<string, Cart>) {
    this.getActiveCartUseCase = getActiveCartUseCase
  }

  async handle(
    request: HttpRequest<unknown, CustomerId, unknown>,
    response: HttpResponse
  ): Promise<HttpResponse> {
    const { accountId, guestId } = request.query
    const accountGuestActiveCartStrategy = new AccountGuestActiveCartStrategy(this.getActiveCartUseCase)
    const guestActiveCartStrategy = new GuestActiveCartStrategy(this.getActiveCartUseCase)
    const accountActiveCartStrategy = new AccountActiveCartStrategy(this.getActiveCartUseCase)
    
    if (accountId && guestId) {
      return accountGuestActiveCartStrategy.getActiveCart(request, response)
    }

    if (!accountId && guestId) {
      return guestActiveCartStrategy.getActiveCart(request, response)
    }
    
    return accountActiveCartStrategy.getActiveCart(request, response)
  }
}
