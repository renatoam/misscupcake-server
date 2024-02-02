import { Entity } from "@shared/domain/ports/Entity";
import { UniqueEntityID } from "@shared/domain/UniqueEntityID";
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
  
  public total(): number {
    return this.finalPrice * this.quantity
  }

  public get id(): UniqueEntityID {
    return this._id
  }
  
  public get productId(): string {
    return this.props.productId
  }
  
  public get cartId(): string | undefined {
    return this.props.cartId
  }

  public setCartId(id: UniqueEntityID): void {
    this.props.cartId = id.toString()
  }

  public get name(): string | undefined {
    return this.props.name
  }

  public get image(): string | undefined {
    return this.props.image
  }
  
  public get message(): string | undefined {
    return this.props.message
  }
  
  public get quantity(): number {
    return this.props.quantity
  }
  
  public setQuantity(newQuantity: number): void {
    this.props.quantity = newQuantity
  }
  
  public get unitPrice(): number | undefined {
    return this.props.unitPrice
  }

  public setUnitPrice(price: number): void {
    this.props.unitPrice = price
  }
  
  public get finalPrice(): number {
    return this.props.finalPrice ?? 0
  }

  public get discountAmount(): number {
    return this.props.discountAmount ?? 0
  }

  public get removed(): boolean {
    return !!this.props.removed
  }
}
