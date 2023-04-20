import { AddToCartController } from "@cart/features/addToCart/AddToCartController";
import { getActiveCart } from "@cart/features/getActiveCart";
import { validateCustomerId } from "@middlewares/cart/getActiveCartMiddleware";
import { Router } from "express";

const cartRouter = Router()

cartRouter.get('/active', validateCustomerId, getActiveCart)

cartRouter.post('/create', new AddToCartController().handle)

export default cartRouter
