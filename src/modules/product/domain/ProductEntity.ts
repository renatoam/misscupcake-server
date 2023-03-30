import { ProductProps } from "./ProductProps";

export class Product {
  private props: ProductProps.Root

  private constructor(props: ProductProps.Root) {
    this.props = props
  }

  public static create(props: ProductProps.Root): Product {
    if (!props.name) throw Error('Name is required.')

    return new Product(props)
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

  public get price(): ProductProps.Price {
    return this.props.price
  }

  public get availability(): ProductProps.Availability {
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

  public get specification(): ProductProps.Specification {
    return this.props.specification
  }
}
