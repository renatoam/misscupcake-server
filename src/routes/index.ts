import { Router } from "express";
import cartRouter from "./cart";
import contentRouter from "./content";
import productRouter from "./products";

const router = Router()

router.use('/products', productRouter)
router.use('/content', contentRouter)
router.use('/carts', cartRouter)

export default router
