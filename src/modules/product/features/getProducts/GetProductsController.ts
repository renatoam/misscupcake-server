import { Controller } from "@base/Controller";
import { Result, UseCase } from "@base/UseCase";
import { ProductProps } from "@product/domain/ProductProps";
import { createFilter } from "@shared/helpers/filterHelpers";
import { RawFilter } from "@shared/types/FilterTypes";
import { Request, Response } from "express";

export class GetProductsController implements Controller<Request, Response> {
  private useCase: UseCase<ProductProps.Root[]>

  constructor(useCase: UseCase<ProductProps.Root[]>) {
    this.useCase = useCase
  }

  async handle(request: Request, response: Response): Promise<Response> {
    const rawFilter = request.query as RawFilter
    const filter = createFilter(rawFilter)
  
    try {
      const result = await this.useCase.run(filter)
      return response.status(result.status).json(result.data)
    } catch (err) {
      const result = err as Result<Error>
      return response.status(500).json({
        message: 'Error on getting products',
        details: result.error
      })
    }
  }
}
