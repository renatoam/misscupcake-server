import { addToCart } from "@cart/main/addToCartContainer";
import { getActiveCart } from "@cart/main/getActiveCartContainer";
import { validateCustomerId } from "@cart/frameworksDrivers/middlewares/getActiveCartMiddleware";
import { Request, Response, Router } from "express";
import { supabase } from "@shared/frameworksDrivers/supabase";
import { UpdateCartRequestDTO } from "@cart/interfaceAdapters/dtos/UpdateCartDTO";

const cartRouter = Router()

cartRouter.get('/active', validateCustomerId, getActiveCart)
cartRouter.post('/create', addToCart)

// It has appeared a question, does make sense update the whole cart instead of just the item?
// I think not unless we have something like promo or shipping in cart, otherwise just updating the item is enough
// so I'm adding a new discount field into cart dto. This should represent some sort of coupon or similar
// I won't create any new field in table, just calculate it on the fly. I can create a discount/deals service later
// I need to do the same for the addToCart use case as well
cartRouter.put('/update', async (request: Request, response: Response) => {
  const { cartId, cartItems } = request.body as UpdateCartRequestDTO

  if (!cartId) {
    return response.status(400).json('Cart ID is required.')
  }
  
  if (!cartItems.length) {
    return response.status(400).json('Cart should contain items.')
  }

 // create logic for handling discounts
})

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
