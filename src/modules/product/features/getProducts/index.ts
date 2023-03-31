import { ProductRepository } from "@product/infrastructure/ProductRepository"
import { Request, Response } from "express"
import { GetProductsController } from "./GetProductsController"
import { GetProductsUseCase } from "./GetProductsUseCase"

export const productRepository = new ProductRepository()
export const getProductsUseCase = new GetProductsUseCase(productRepository)
export const getProductsController = new GetProductsController(getProductsUseCase)

// Circular Dependency: if I don't do this, it loses the reference
export const getProducts = (request: Request, response: Response) => {
  return getProductsController.handle(request, response)
}
