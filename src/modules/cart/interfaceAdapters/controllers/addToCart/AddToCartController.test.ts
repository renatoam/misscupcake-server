import { supabase } from "@shared/frameworksDrivers/supabase";
import { Router } from "express";
import createServer from 'src/server';
import supertest from "supertest";
import { afterEach, beforeEach, describe, expect, it, vitest } from "vitest";
import { AddToCartController } from "./AddToCartController";
import { AddToCartUseCase } from "@cart/useCases/addToCart/AddToCartUseCase";
import { SupabaseCartRepository } from "@cart/frameworksDrivers/repositories/SupabaseCartRepository";
import { CustomCartMapper } from "@cart/frameworksDrivers/mappers/CustomCartMapper";
import { SupabaseCartItemRepository } from "@cart/frameworksDrivers/cartItem/SupabaseCartItemRepository";
import { CustomCartItemMapper } from "@cart/frameworksDrivers/cartItem/CustomCartItemMapper";
import { CustomProductMapper } from "@product/frameworksDrivers/mappers/CustomProductMapper";
import { SupabaseProductRepository } from "@product/frameworksDrivers/repositories/SupabaseProductRepository";
import { GetActiveCartUseCase } from "@cart/useCases/GetActiveCartUseCase";
import { SimpleCartResponseDTO } from "@cart/interfaceAdapters/dtos/SimpleCartDTO";

const appRouter = Router()
const cartsRouter = Router()

const cartMapper = new CustomCartMapper()
const cartItemMapper = new CustomCartItemMapper()
const productMapper = new CustomProductMapper()

const cartRepository = new SupabaseCartRepository(cartMapper)
const cartItemRepository = new SupabaseCartItemRepository(cartItemMapper)
const productRepository = new SupabaseProductRepository(productMapper)

const addToCartUseCase = new AddToCartUseCase(cartRepository, cartItemRepository, productRepository)
const getActiveCartUseCase = new GetActiveCartUseCase(cartRepository, cartItemRepository, productRepository)
const addToCartController = new AddToCartController(getActiveCartUseCase, addToCartUseCase)

cartsRouter.post('/carts/create', addToCartController.handle)
appRouter.use('/api/v1', cartsRouter)

const server = createServer({
  connections: [vitest.fn()],
  router: appRouter
})

describe('AddToCartController', () => {
  const validProduct = { id: 'b0d94dbd-1675-4fc5-bbb6-b13396d73fec', quantity: 23 }
  const validAccount = '93795b02-a713-45be-afad-05e257ab64fd'
  const cartId = 'b8559b13-4481-4eb8-8651-97cecf7e57a4'

  let request: supertest.Test | any

  beforeEach(async () => {
    request = supertest(server).post('/api/v1/carts/create')
    
    await supabase
      .from('cart')
      .delete()
      .eq('id', cartId)
    
    await supabase
      .from('account')
      .insert({ id: validAccount })
  })
    
  afterEach(async () => {
    request = null

    await supabase
      .from('account')
      .delete()
      .eq('id', validAccount)
  })

  describe('given a valid account ID and valid products', () => {
    describe('a successful request', () => {
      it('should return 200 as status response', async () => {
        const response = await request.send({
          accountId: validAccount,
          products: [validProduct]
        })
          
        expect(response.status).toBe(200)
      })

      it('should return json as content response type', async () => {
        const response = await request.send({ accountId: validAccount, products: [] })
          
        expect(response.headers['content-type']).toContain('json')
      })
    })

    describe('account ID does not have a valid Cart associated yet', () => {
      it('should create a new cart for the account', async () => {
        const response = await request.send({ accountId: validAccount, products: [validProduct] })
        
        expect(response.body).toHaveProperty('cartId')
        expect(response.status).toBe(200)
      })

      it('should create a new cart with the proper format', async () => {
        const response = await request.send({ accountId: validAccount, products: [validProduct] })
        const result: SimpleCartResponseDTO = response.body
        
        expect(result).toHaveProperty('cartId')
        expect(result).toHaveProperty('accountId')
        expect(result).toHaveProperty('items')
        expect(result).toHaveProperty('subtotal')
        expect(result).toHaveProperty('total')
      })
    })

    describe('when account ID already has a valid Cart associated', () => {
      const mockAccountID = '927f4975-d65b-42da-a70e-2921eb2a026f'
      const mockCartID = '7373e4ce-007e-4606-9a13-a282a3285eeb'
      let cart: any = null

      beforeEach(async () => {
        const { error: accountError } = await supabase
          .from('account')
          .insert({ id: mockAccountID })

        if (accountError) {
          console.error(accountError)
          throw Error('Error on creating account')
        }
        
        const { data, error } = await supabase
          .from('cart')
          .insert({
            status: 'active',
            account_id: mockAccountID,
            id: mockCartID
          })
          .select()
          .maybeSingle()
        
        if (error) {
          console.error(error)
          throw Error('Error on creating cart')
        }

        cart = data
      })
      
      afterEach(async () => {
        cart = null

        const { error: cartError } = await supabase
          .from('cart')
          .delete()
          .eq('id', mockCartID)

        if (cartError) {
          console.error(cartError)
          throw Error('Error on deleting cart')
        }

        const { error: accountError } = await supabase
          .from('account')
          .delete()
          .eq('id', mockAccountID)
  
        if (accountError) {
          console.error(accountError)
          throw Error('Error on deleting account')
        }
      })

      it('should return the existent cart and status code 200', async () => {
        const response = await request.send({ accountId: mockAccountID, products: [validProduct] })
        
        expect(response.body.cartId).toBe(cart?.id)
        expect(response.status).toBe(200)
      })

      describe('cart item does not exist yet', () => {
        it('should create a new cart item with the given data', async () => {
          const response = await request.send({ accountId: mockAccountID, products: [validProduct] })
        
          expect(response.body.items.length).toBe(1)
          expect(response.body.items[0].product_id).toBe(validProduct.id)
        })
      })
  
      describe('cart item already exists', () => {
        beforeEach(async () => {
          const newCartitems = [validProduct].map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            cart_id: mockCartID,
            id: '5aadfae6-236d-44c2-a428-176c7749bc01'
          }))
          
          const { error: cartItemsError } = await supabase
            .from('cart_item')
            .insert(newCartitems)
            .select()

          if (cartItemsError) {
            throw Error('Error on creating cart item')
          }
        })

        it('should update the existent cart item and do not create another one',async () => {
          const updatedProduct = { ...validProduct, quantity: 20 }
          const response = await request.send({ accountId: mockAccountID, products: [updatedProduct] })
        
          expect(response.body.items?.length).toBe(1)
          expect(response.body.items?.[0].product_id).toBe(validProduct.id)
          expect(response.body.items?.[0].quantity).toBe(updatedProduct.quantity)
        })
      })
    })

  })

  describe('given an invalid account ID or products format', () => {
    it('should return status 400 if no account ID is provided', async () => {
      const response = await request.send({ products: [] })
          
      expect(response.status).toBe(400)
    })

    it('should return status 400 if account ID has invalid format', async () => {
      const response = await request.send({ accountId: 1, products: [] })
      
      expect(response.status).toBe(400)
    })

    it('should return status code 400 if no products are provided', async () => {
      const response = await request.send({ accountId: validAccount })
      
      expect(response.status).toBe(400)
    })

    it('should return status code 400 if products are provided with wrong format', async () => {
      const response = await request.send({ accountId: validAccount, products: [{ prodId: 1 }] })
      
      expect(response.status).toBe(400)
    })
    
    it('should return status code 400 if products are provided with wrong ID format', async () => {
      const response = await request.send({ accountId: validAccount, products: [{ id: 1, quantity: 2 }] })
      
      expect(response.status).toBe(400)
    })
  })
})
