import { Result } from "@shared/errors";
import { Availability, ProductProps, Specification } from "./ProductProps";

export class Product {
  public readonly props: ProductProps

  private constructor(props: ProductProps) {
    this.props = props
  }

  public static create(props: ProductProps): Result<Product, Error> {
    if (!props.name) throw Error('Name is required.')

    return Result.success<Product>(new Product(props))
  }

  public get discountAmount(): number {
    return (this.unitPrice * this.discountPercent) / 100
  }

  public get price(): number {
    return this.unitPrice - this.discountAmount
  }
  
  public get id(): string {
    return this.props.id
  }
  
  public get name(): string {
    return this.props.name
  }

  public get description(): string {
    return this.props.description
  }

  public get unitPrice(): number {
    return this.props.price.current
  }

  public get discountPercent(): number {
    return this.props.price.discount
  }

  public get availability(): Availability {
    return this.props.availability
  }

  public get images(): string[] {
    return this.props.images
  }

  public get rating(): number {
    return this.props.rating
  }

  public get reviews(): string[] {
    return this.props.reviews
  }

  public get specification(): Specification {
    return this.props.specification
  }
}
