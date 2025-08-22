import { Router } from "express";
import cartRouter from "../../cart/main/cartRouter";
import contentRouter from "../../content/main/contentRouter";
import productRouter from "../../product/main/productRouter";
import accountRouter from "src/modules/account/accountRouter";

const router = Router()

router.get('/', (_, res: any) => res.send('Foi'))

// placeholder route
router.post('/login', (req: any, res) => {
  const { id } = req.body

  if (!id) {
    return res.status(401).json({ message: 'User not authorized.' })
  }

  return res.status(200).json({ message: 'Success.' })
})

router.use('/products', productRouter)
router.use('/content', contentRouter)
router.use('/carts', cartRouter)
router.use('/accounts', accountRouter)

export default router
