import { addToCart } from "@cart/main/addToCartContainer";
import { getActiveCart } from "@cart/main/getActiveCartContainer";
import { validateCustomerId } from "@cart/frameworksDrivers/middlewares/getActiveCartMiddleware";
import { Router } from "express";

const cartRouter = Router()

cartRouter.get('/active', validateCustomerId, getActiveCart)
cartRouter.post('/create', addToCart)

export default cartRouter
