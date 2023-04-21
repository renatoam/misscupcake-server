import { SimpleCartResponseDTO } from "@cart/domain/CartProps";
import { supabase } from "@database";
import { Router } from "express";
import createServer from 'src/server';
import supertest from "supertest";
import { afterEach, beforeEach, describe, expect, it, vitest } from "vitest";
import { AddToCartController } from "./AddToCartController";

const router = Router()
const appServer = createServer({
  connections: [vitest.fn()],
  router
})
router.post('/carts/create', new AddToCartController().handle)
const server = appServer.use('/api/v1', router)

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
  })

  afterEach(() => {
    request = null
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
        
        expect(response.body.cartId).toBe(cartId)
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

    describe.todo('account ID already has a valid Cart associated')

    describe.todo('cart item does not exist yet')

    describe.todo('cart item already exists')
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
