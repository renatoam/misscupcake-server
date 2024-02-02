import { Entity } from "@shared/domain/ports/Entity";
import { UniqueEntityID } from "@shared/domain/UniqueEntityID";
import { Result } from "@shared/errors";
import { CartItem } from "../../../cartItem/domain/CartItemEntity";
import { CartProps } from "./CartProps";

export class Cart extends Entity<CartProps> {
  private constructor(props: CartProps, id?: UniqueEntityID) {
    super(props, id)
  }

  public static create(props: CartProps, id?: UniqueEntityID): Result<Cart, Error> {
    const newCart = new Cart(props, id)

    return Result.success(newCart)
  }

  private getSubtotal(): number {
    if (!this.props.items) return 0

    const res = this.props.items.reduce((acc, item) => {
      acc = acc + (item.unitPrice ? (item.unitPrice * item.quantity) : 0)
      return acc
    }, 0)
    return res
  }

  private getTotalDiscountAmount(): number {
    if (!this.props.items) return 0

    const res = this.props.items.reduce((acc, item) => {
      acc += item.discountAmount ? item.discountAmount * item.quantity : 0
      return acc
    }, 0)
    return res
  }

  public setItems(items: CartItem[]) {
    this.props.items = items
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
    return this.props.items ?? []
  }

  public get accountId(): UniqueEntityID {
    return this.props.accountId
  }
}
