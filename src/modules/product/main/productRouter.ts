import { getFeatured } from "@product/main/getFeaturedContainer"
import { getProducts } from "@product/main/getProductsContainer"
import { Router } from "express"

const productRouter = Router()

productRouter.get('/featured', getFeatured)
productRouter.get('/', getProducts)

export default productRouter
