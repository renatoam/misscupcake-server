import { getFeatured } from "@product/features/getFeatured"
import { getProducts } from "@product/features/getProducts"
import { Router } from "express"

const productRouter = Router()

productRouter.get('/featured', getFeatured)
productRouter.get('/', getProducts)

export default productRouter
