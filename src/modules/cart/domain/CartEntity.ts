import { Entity } from "@base/Entity";
import { UniqueEntityID } from "@base/UniqueEntityID";
import { Result } from "@shared/errors";
import { CartItem } from "./CartItemEntity";
import { CartProps } from "./CartProps";

export class Cart extends Entity<CartProps> {
  private constructor(props: CartProps, id?: UniqueEntityID) {
    super(props, id)
  }

  public static create(props: CartProps, id?: UniqueEntityID): Result<Cart, Error> {
    if (!props.items?.length) {
      return Result.fail(Error('Cannot create an empty cart.'))
    }

    const newCart = new Cart(props, id)

    return Result.success(newCart)
  }

  private getSubtotal(): number {
    if (!this.props.items) return 0

    return this.props.items.reduce((acc, item) => {
      acc += item.unitPrice * item.quantity
      return acc
    }, 0)
  }

  private getTotalDiscountAmount(): number {
    if (!this.props.items) return 0

    return this.props.items.reduce((acc, item) => {
      acc += item.discountAmount ? item.discountAmount * item.quantity : 0
      return acc
    }, 0)
  }

  public get id(): UniqueEntityID {
    return this._id
  }

  public get status(): string {
    return this.props.status
  }

  public get subtotal(): number {
    return this.getSubtotal()
  }

  public get total(): number {
    return this.getSubtotal() - this.getTotalDiscountAmount()
  }
  
  public get items(): CartItem[] {
    return this.props.items || []
  }

  public get accountId(): UniqueEntityID {
    return this.props.accountId
  }
}
