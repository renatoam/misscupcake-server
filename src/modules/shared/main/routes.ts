import { Router } from "express";
import cartRouter from "../../cart/main/cartRouter";
import contentRouter from "../../content/main/contentRouter";
import productRouter from "../../product/main/productRouter";
import accountRouter from "src/modules/account/accountRouter";

const router = Router()

router.use('/products', productRouter)
router.use('/content', contentRouter)
router.use('/carts', cartRouter)
router.use('/accounts', accountRouter)

export default router
