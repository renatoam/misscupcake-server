import { ClientError, Result } from "@shared/errors"
import IncomingID from "../../../shared/domain/IncomingID"
import { BareItemDTO } from "@cart/interfaceAdapters/dtos/SimpleItemsDTO"

export class SimpleProduct {
  private value: BareItemDTO

  private constructor(product: BareItemDTO) {
    this.value = product
  }

  public getValue(): BareItemDTO {
    return this.value
  }

  static createMultiple(products?: BareItemDTO[]): Result<SimpleProduct[], Error> {
    if (!products?.length) {
      return Result.fail(new ClientError(Error('A product list is required.')))
    }

    const simpleProductsOrError = products.map(item => SimpleProduct.create(item))
    const invalidProduct = simpleProductsOrError.find(item => item.isError())

    if (invalidProduct) {
      return Result.fail(invalidProduct.getError())
    }

    return Result.success(simpleProductsOrError.map(item => item.getValue()))
  }

  static create(product?: BareItemDTO): Result<SimpleProduct, Error> {
    if (!product || !Object.keys(product).length) {
      return Result.fail(new ClientError(Error('Item invalid.')))
    }

    if (!Object.hasOwn(product, 'id') || !Object.hasOwn(product, 'quantity')) {
      return Result.fail(new ClientError(Error('Invalid product format.')))
    }

    const productIdOrError = IncomingID.create(product.id)

    if (productIdOrError.isError()) {
      return Result.fail(productIdOrError.getError())
    }

    const simpleProduct = {
      ...product,
      id: productIdOrError.getValue().getString()
    }

    return Result.success(new SimpleProduct(simpleProduct))
  }
}
