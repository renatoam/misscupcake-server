import { getProducts } from "@product/features/getProducts"
import { CustomProductRepository } from "@product/infrastructure/CustomProductRepository"
import { Response, Router } from "express"

const productRouter = Router()

productRouter.get('/featured', async (_, response: Response) => {
  const productRepository = new CustomProductRepository()

  try {
    const products = await productRepository.getFeatured()

    return response.status(200).json(products.getValue())
  } catch (error) {
    return response.status(500).send('Something wrong.')
  }
})

productRouter.get('/', getProducts)

export default productRouter
