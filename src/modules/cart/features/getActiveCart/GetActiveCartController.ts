import { Controller } from "@base/Controller";
import { HttpRequest, HttpResponse } from "@shared/types/httpTypes";
import { AccountActiveCartStrategy } from "./AccountActiveCartStrategy";
import { AccountGuestActiveCartStrategy } from "./AccountGuestActiveCartStrategy";
import { ActiveCartContext, ActiveCartUseCase } from "./ActiveCartContext";
import { GuestActiveCartStrategy } from "./GuestActiveCartStrategy";

export type CustomerId = { accountId?: string, guestId?: string, use?: 'guest' | 'account' }

export class GetActiveCartController implements Controller {
  private getActiveCartUseCase: ActiveCartUseCase
  
  constructor(getActiveCartUseCase: ActiveCartUseCase) {
    this.getActiveCartUseCase = getActiveCartUseCase
  }

  async handle(
    request: HttpRequest<unknown, CustomerId, unknown>,
    response: HttpResponse
  ): Promise<HttpResponse> {
    const { accountId, guestId } = request.query
    const activeCart = new ActiveCartContext(
      AccountActiveCartStrategy,
      this.getActiveCartUseCase
    )
    
    if (accountId && guestId) {
      activeCart.setStrategy(AccountGuestActiveCartStrategy)
    }

    if (!accountId && guestId) {
      activeCart.setStrategy(GuestActiveCartStrategy)
    }

    return activeCart.execute(request, response)
  }
}
