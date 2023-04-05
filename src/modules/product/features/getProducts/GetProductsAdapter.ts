import { Product } from "@product/domain/ProductEntity";
import { GetProductsDTO } from "./GetProductsDTO";

export function getProductsAdapter(product: Product): GetProductsDTO {
  return {
    id: product.id,
    name: product.name,
    image: product.images[0],
    description: product.description,
    stock: product.availability.inStock
  }
}
