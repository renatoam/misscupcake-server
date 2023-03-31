import { CustomProductRepository } from "@product/infrastructure/CustomProductRepository"
import { Request, Response } from "express"
import { GetProductsController } from "./GetProductsController"
import { GetProductsUseCase } from "./GetProductsUseCase"

export const customProductRepository = new CustomProductRepository()
export const getProductsUseCase = new GetProductsUseCase(customProductRepository)
export const getProductsController = new GetProductsController(getProductsUseCase)

export const getProducts = (request: Request, response: Response) => {
  return getProductsController.handle(request, response)
}
