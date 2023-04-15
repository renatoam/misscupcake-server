import { ActiveCartStrategy } from "@cart/application/ActiveCartStrategy";
import { CartUseCase } from "@cart/application/CartUseCase";
import { Cart } from "@cart/domain/CartEntity";
import { HttpRequest, HttpResponse } from "@shared/types/httpTypes";
import { CustomerId } from "./GetActiveCartController";

export type ActiveCartUseCase = CartUseCase<string, Cart>

export class ActiveCartContext {
  private strategy: ActiveCartStrategy
  private useCase: ActiveCartUseCase

  constructor(
    strategy: new (useCase: ActiveCartUseCase) => ActiveCartStrategy,
    useCase: ActiveCartUseCase
  ) {
    this.useCase = useCase
    this.strategy = new strategy(this.useCase)
  }

  setStrategy(strategy: new (useCase: ActiveCartUseCase) => ActiveCartStrategy) {
    this.strategy = new strategy(this.useCase)
  }

  async execute(request: HttpRequest<unknown, CustomerId, unknown>, response: HttpResponse<any>) {
    return this.strategy.getActiveCart(request, response)
  }
}
