import { Entity } from "@base/Entity";
import { UniqueEntityID } from "@base/UniqueEntityID";
import { Result } from "@shared/errors";
import { CartItemProps } from "./CartItemProps";

export class CartItem extends Entity<CartItemProps> {
  private constructor(props: CartItemProps, id?: UniqueEntityID) {
    super(props, id)
  }

  public static create(props: CartItemProps, id?: UniqueEntityID): Result<CartItem, Error> {
    const newCartItem = new CartItem(props, id)
    return Result.success(newCartItem)
  }

  public get id(): UniqueEntityID {
    return this._id
  }

  public get name(): string {
    return this.props.name
  }

  public get image(): string {
    return this.props.image
  }
  
  public get message(): string | undefined {
    return this.props.message
  }
  
  public get quantity(): number {
    return this.props.quantity
  }
  
  public get unitPrice(): number {
    return this.props.unitPrice
  }
  
  public get subtotal(): number {
    return this.props.subtotal
  }
  
  public get total(): number {
    return this.props.total
  }

  public get discountAmount(): number | undefined {
    return this.props.discountAmount
  }

  public get removed(): boolean {
    return !!this.props.removed
  }
}
