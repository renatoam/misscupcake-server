import { Response, Router } from "express";
import { supabase } from "./database";
import { ProductRepository } from "./features/shared/product/repositories/ProductRepository";

const router = Router()

router.get('/featured', async (_, response: Response) => {
  const productRepository = new ProductRepository()

  try {
    const products = await productRepository.getFeatured()

    return response.status(200).json(products)
  } catch (error) {
    console.log(error)

    return response.status(500).send('Something wrong.')
  }
})

// create a repo that receives a database (unknown) as argument (dependency injection)
// so that I can mock the db using vi.fn() to avoid changes on the real db
router.get('/products', async (req, res) => {
  const { field } = req.query as any
  const { data, error, status } = await supabase
    .from('product')
    .select(`
      ${field || '*'},
      product_price(*),
      product_availability(*),
      product_image(*),
      product_rating(*),
      product_review(*),
      product_specification(*)
    `)
  
  if (error) {
    return res.status(status).json({ error, message: 'Server Error' })
  }

  return res.status(200).json(data)
})

export default router
