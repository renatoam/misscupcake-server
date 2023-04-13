import { getActiveCart } from "@cart/features/getActiveCart";
import { validateCustomerId } from "@middlewares/cart/getActiveCartMiddleware";
import { Router } from "express";

const cartRouter = Router()

cartRouter.get('/active', validateCustomerId, getActiveCart)

export default cartRouter
