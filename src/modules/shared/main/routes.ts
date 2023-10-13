import { Router } from "express";
import cartRouter from "../../cart/main/cartRouter";
import contentRouter from "../../content/main/contentRouter";
import productRouter from "../../product/main/productRouter";

const router = Router()

router.use('/products', productRouter)
router.use('/content', contentRouter)
router.use('/carts', cartRouter)

export default router
