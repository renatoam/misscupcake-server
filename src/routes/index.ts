import { Router } from "express";
import contentRouter from "./content";
import productRouter from "./products";

const router = Router()

router.use('/products', productRouter)
router.use('/content', contentRouter)

export default router
