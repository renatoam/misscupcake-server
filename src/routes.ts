import { Router } from "express";
import { supabase } from "./database";

const router = Router()

router.get('/products', async (_, res) => {
  const products = await supabase.from('product').select('*')

  return res.status(200).json(products)
})

export default router
