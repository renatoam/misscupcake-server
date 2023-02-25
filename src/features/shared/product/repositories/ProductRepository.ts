import { supabase } from "../../../../database";
import { Repository } from "../../base/Repository";
import { productToDomain } from "../adapters/ProductToDomainAdapter";
import { Product } from "../protocols/domain";
import { PersistenceProduct } from "../protocols/persistence";

export class ProductRepository implements Repository<PersistenceProduct.Root> {
  getAll(filter?: unknown): Promise<PersistenceProduct.Root[]> {
    throw new Error("Method not implemented.");
  }
  getById(id: string): Promise<any> {
    throw new Error("Method not implemented.");
  }
  save(data: any): Promise<void> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async getFeatured(): Promise<Product.Root[]> {
    const { data, error } = await supabase
    .from('product')
    .select(`*,
      product_price(*),
      product_availability(*),
      product_image(*),
      product_rating(*),
      product_review(*),
      product_specification(*)
    `)
    .limit(3)

    if (error) throw Error(error.message)

    const products = data

    return products.map(product => productToDomain(product))
  }
}
