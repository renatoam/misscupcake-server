import { Router } from "express";

const router = Router()

router.get('/products', (_, res) => {
  return res.send('products')
})

export default router
