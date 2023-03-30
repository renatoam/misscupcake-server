import { supabase } from "@database";
import { Filter } from "@shared/types/FilterTypes";
import { Repository } from "../../base/Repository";
import { productToDomain } from "../adapters/ProductToDomainAdapter";
import { ProductProps } from "../domain/ProductProps";

export class ProductRepository implements Repository<ProductProps.Root> {
  async getAll(filter: Filter = {} as Filter): Promise<ProductProps.Root[]> {
    let query = supabase
    .from('product')
    .select(`*,
      product_price!inner(*),
      product_availability!inner(*),
      product_image(*),
      product_rating!inner(*),
      product_review(*),
      product_specification!inner(*)
    `)

    if (filter.price) {
      query = query[filter.price.condition]('product_price.price', filter.price.value)
    }

    if (filter.shelf_life) {
      query = query[filter.shelf_life.condition]('product_specification.shelf_life', filter.shelf_life.value)
    }

    if (filter.in_stock) {
      query = query[filter.in_stock.condition]('product_availability.in_stock', filter.in_stock.value)
    }

    if (filter.rating) {
      query = query[filter.rating.condition]('product_rating.rating', filter.rating.value)
    }

    try {
      const { data: products, error } = await query

      if (error) {
        throw Error(error.message)
      }

      return products.map(product => productToDomain(product))
    } catch (error) {
      throw Error('Error on connecting with the database.')
    }
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

  async getFeatured(): Promise<ProductProps.Root[]> {
    const { data: products, error } = await supabase
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

    return products.map(product => productToDomain(product))
  }
}
