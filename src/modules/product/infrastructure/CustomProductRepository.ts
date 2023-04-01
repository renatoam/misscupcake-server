import { supabase } from "@database";
import { FEATURED_DEFAULT_LIMIT } from "@product/constants";
import { Result } from "@shared/errors";
import DatabaseError from "@shared/errors/DatabaseError";
import QueryError from "@shared/errors/QueryError";
import { Filter } from "@shared/types/FilterTypes";
import { productToDomain } from "../adapters/ProductToDomainAdapter";
import { ProductProps } from "../domain/ProductProps";
import { ProductRepository } from "./ProductRepository";

// TODO: create a repo that receives a database (unknown) as argument (dependency injection)
// so that I can mock the db using vi.fn() to avoid changes on the real db
export class CustomProductRepository implements ProductRepository {
  async getAll(filter: Filter = {} as Filter): Promise<Result<ProductProps.Root[], Error>> {
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
        const queryError = new QueryError(Error(error.message))
        return Result.fail<QueryError>(queryError)
      }

      const adapteeProducts = products.map(product => productToDomain(product))
      return Result.success(adapteeProducts)
    } catch (error) {
      const databaseError = new DatabaseError(Error())
      return Result.fail<DatabaseError>(databaseError)
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

  async getFeatured(limit: number = FEATURED_DEFAULT_LIMIT): Promise<Result<ProductProps.Root[], Error>> {
    try {
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
      .limit(limit)

      if (error) {
        const queryError = new QueryError(Error(error.message))
        return Result.fail<QueryError>(queryError)
      }

      const adapteeProducts = products.map(product => productToDomain(product))
      return Result.success(adapteeProducts)
    } catch (error) {
      const databaseError = new DatabaseError(Error())
      return Result.fail<DatabaseError>(databaseError)
    }
  }
}
