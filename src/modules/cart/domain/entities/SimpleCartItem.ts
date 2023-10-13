import { ClientError, Result } from "@shared/errors"
import IncomingID from "../../../shared/domain/IncomingID"
import { BareItemDTO } from "@cart/interfaceAdapters/dtos/SimpleItemsDTO"

export class SimpleCartItem {
  private value: BareItemDTO

  private constructor(cartItem: BareItemDTO) {
    this.value = cartItem
  }

  public getValue(): BareItemDTO {
    return this.value
  }

  static createMultiple(cartItems?: BareItemDTO[]): Result<SimpleCartItem[], Error> {
    if (!cartItems?.length) {
      return Result.fail(new ClientError(Error('A cart item list is required.')))
    }

    const simpleCartItems = cartItems.map(item => SimpleCartItem.create(item))
    const invalidCartItem = simpleCartItems.find(item => item.isError())

    if (invalidCartItem) {
      return Result.fail(invalidCartItem.getError())
    }

    return Result.success(simpleCartItems.map(item => item.getValue()))
  }

  static create(cartItem?: BareItemDTO): Result<SimpleCartItem, Error> {
    if (!cartItem || !Object.keys(cartItem).length) {
      return Result.fail(new ClientError(Error('Item invalid.')))
    }

    if (!Object.hasOwn(cartItem, 'id') || !Object.hasOwn(cartItem, 'quantity')) {
      return Result.fail(new ClientError(Error('Invalid item format.')))
    }

    const cartItemIdOrError = IncomingID.create(cartItem.id)

    if (cartItemIdOrError.isError()) {
      return Result.fail(cartItemIdOrError.getError())
    }

    const simpleCartItem = {
      ...cartItem,
      id: cartItemIdOrError.getValue().getString()
    }

    return Result.success(new SimpleCartItem(simpleCartItem))
  }
}
