import { addToCart } from "@cart/main/addToCartContainer";
import { getActiveCart } from "@cart/main/getActiveCartContainer";
import { validateCustomerId } from "@cart/frameworksDrivers/middlewares/getActiveCartMiddleware";
import { Request, Response, Router } from "express";
import { supabase } from "@shared/frameworksDrivers/supabase";

const cartRouter = Router()

cartRouter.get('/active', validateCustomerId, getActiveCart)
cartRouter.post('/create', addToCart)

cartRouter.get('/', async (_request: Request, response: Response) => {
  try {
    const { data, error } = await supabase.from('cart').select('*')

    if (error) {
      return response.status(500).json('Something went wrong on deleting cart.')
    }

    return response.status(200).json(data)
  } catch (error) {
    return response.status(500).json('Something went wrong on deleting cart.')
  }
})

cartRouter.delete('/delete/:id', async (request: Request, response: Response) => {
  const { id } = request.params

  try {
    const { error } = await supabase.from('cart').delete().eq('id', id)

    if (error) {
      return response.status(500).json('Something went wrong on deleting cart.')
    }
  } catch (error) {
    return response.status(500).json('Something went wrong on deleting cart.')
  }

  return response.status(204)
})

export default cartRouter
