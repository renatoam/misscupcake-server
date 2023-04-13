import { Identifier } from "@base/Identifier";
import { Cart } from "@cart/domain/CartEntity";
import { CartItem } from "@cart/domain/CartItemEntity";
import { CartRepository } from "@cart/infrastructure/CartRepository";
import { validateCustomerId } from "@middlewares/cart/getActiveCartMiddleware";
import { NotFoundError, Result } from "@shared/errors";
import { Router } from "express";
import createServer from "src/server";
import request from "supertest";
import { Mock, beforeEach, describe, expect, it, vitest } from "vitest";
import { SimpleCartResponseDTO } from "../addToCart/AddToCartProps";
import { GetActiveCartController } from "./GetActiveCartController";

const router = Router()
const mongoConnection = vitest.fn()

// actually, I need to mock the use case later
const cartRepositoryMock: CartRepository = {
  getCartsByCustomerId: vitest.fn(),
  getAll: vitest.fn(),
  getById: vitest.fn(),
  save: vitest.fn(),
  delete: vitest.fn(),
  getActiveCart: vitest.fn()
}

const getActiveCartController = new GetActiveCartController(cartRepositoryMock)
router.get('/carts', validateCustomerId, (request, response) => getActiveCartController.handle(request, response))

const appServer = createServer({
  connections: [mongoConnection],
  router
})
const server = appServer.use('/api/v1', router)

describe('GetActiveCartController', () => {
  const baseURL = '/api/v1/carts'
  const accountId = '550e8400-e29b-41d4-a716-446655440001'
  const guestId = '550e8400-e29b-41d4-a716-446655440002'

  const newId = new Identifier(123)
  const newCartItem = CartItem.create({ id: 1 } as any)
  const newCart = Cart.create({ status: 'active', items: [newCartItem as any] }, newId).getValue()
  const mockPositiveValue = Result.success([newCart])
  const mockMethod = cartRepositoryMock.getCartsByCustomerId as Mock

  describe('account ID or guest ID are properly provided', () => {
    beforeEach(() => {
      mockMethod.mockReset()
    })

    it('should return status code 200', async () => {
      mockMethod.mockResolvedValue(mockPositiveValue)
      const response = await request(server)
        .get(`${baseURL}?accountId=${accountId}&guestId=${guestId}`)

      expect(response.status).toBe(200)
    })

    it('should return a content json type in the response', async () => {
      mockMethod.mockResolvedValue(mockPositiveValue)
      const response = await request(server)
        .get(`${baseURL}?accountId=${accountId}&guestId=${guestId}`)

      expect(response.headers['content-type']).toContain('json')
    })

    it('should return the active cart in proper format if it is found', async () => {
      mockMethod.mockResolvedValue(mockPositiveValue)
      const response = await request(server)
        .get(`${baseURL}?accountId=${accountId}&guestId=${guestId}`)

      expect(response.body.cartId).toBeDefined()
      expect(response.body.accountId).toBeDefined()
      expect(response.body.subtotal).toBeDefined()
      expect(response.body.total).toBeDefined()
      expect(response.body.items).toBeDefined()
    })

    it('should return status code 404 if no active cart is found', async () => {
      mockMethod.mockResolvedValue(Result.fail(new NotFoundError()))
      const response = await request(server)
        .get(`${baseURL}?accountId=${accountId}&guestId=${guestId}`)

      expect(response.status).toBe(404)
    })

    it('should return status code 404 if no cart at all is found', async () => {
      mockMethod.mockResolvedValue(Result.fail(new NotFoundError()))
      const response = await request(server)
        .get(`${baseURL}?accountId=${accountId}&guestId=${guestId}`)

      expect(response.status).toBe(404)
    })
  })

  describe('guest ID is provided but no account ID', () => {
    it('should return a cart in proper format if guest ID has an active cart associated',
      async () => {
        mockMethod.mockResolvedValue(mockPositiveValue)
        const response = await request(server)
          .get(`${baseURL}?guestId=${guestId}`)
        const result: SimpleCartResponseDTO = response.body

        expect(result.cartId).toBeDefined()
        expect(result.accountId).toBeDefined()
        expect(result.subtotal).toBeDefined()
        expect(result.total).toBeDefined()
        expect(result.items).toBeDefined()
        expect(result.accountId).toBe(guestId)
      }
    )

    it('should return a 404 status code if there is no active cart associated to the guest ID',
      async () => {
        mockMethod.mockResolvedValue(Result.fail(new NotFoundError()))
        const response = await request(server)
          .get(`${baseURL}?guestId=${guestId}`)

        expect(response.status).toBe(404)
      }
    )
  })
  
  describe('account ID is provided but no guest ID', () => {
    it('should return a cart in proper format if account ID has an active cart associated',
      async () => {
        mockMethod.mockResolvedValue(mockPositiveValue)
        const response = await request(server)
          .get(`${baseURL}?accountId=${accountId}`)
        const result: SimpleCartResponseDTO = response.body

        expect(result.cartId).toBeDefined()
        expect(result.accountId).toBeDefined()
        expect(result.subtotal).toBeDefined()
        expect(result.total).toBeDefined()
        expect(result.items).toBeDefined()
        expect(result.accountId).toBe(accountId)
      }
    )

    it('should return a 404 status code if there is no active cart associated to the account ID',
      async () => {
        mockMethod.mockResolvedValue(Result.fail(new NotFoundError()))
        const response = await request(server)
          .get(`${baseURL}?accountId=${accountId}`)

        expect(response.status).toBe(404)
      }
    )
  })

  describe('account ID or guest ID are not properly provided', () => {
    it('should return a status code 400 if account and guest IDs are not provided', async () => {
      const response = await request(server).get(`${baseURL}`)

      expect(response.status).toBe(400)
      expect(response.body.message).toBeDefined()
    })

    it('should return a status code 400 if the guest ID is invalid', async () => {
      const response = await request(server).get(`${baseURL}?guestId=1`)

      expect(response.status).toBe(400)
      expect(response.body.message).toBeDefined()
    })
  })

  describe('both, account and guest IDs, have a cart associated', () => {
    describe('the found active carts IDs are different', () => {
      beforeEach(() => {
        const alternativeCart = Cart.create({
          status: newCart.status,
          items: newCart.items
        }, new Identifier(123456)).getValue()
        
        mockMethod
          .mockResolvedValueOnce(Result.success([newCart]))
          .mockResolvedValueOnce(Result.success([alternativeCart]))
      })
      
      it('should return a status code 409', async () => {        
        const response = await request(server)
          .get(`${baseURL}?accountId=${accountId}&guestId=${guestId}`)
  
        expect(response.status).toBe(409)
      })

      it('should return the account cart if "use" param is "account"', async () => {
        const response = await request(server)
          .get(`${baseURL}?accountId=${accountId}&guestId=${guestId}&use=account`)
        const result = response.body as SimpleCartResponseDTO

        expect(result.accountId).toBe(accountId)
      })

      it('should return the guest cart if "use" param is "guest"', async () => {
        const response = await request(server)
          .get(`${baseURL}?accountId=${accountId}&guestId=${guestId}&use=guest`)
        const result = response.body as SimpleCartResponseDTO

        expect(result.accountId).toBe(guestId)
      })
    })

    describe('the found active carts IDs are the same', () => {
      it('should use the provided account ID as the cart account ID', async () => {
        mockMethod.mockResolvedValue(Result.success([newCart]))
        const response = await request(server)
          .get(`${baseURL}?accountId=${accountId}&guestId=${guestId}`)
        const result = response.body as SimpleCartResponseDTO

        expect(result.accountId).toBe(accountId)
      })
    })
  })
})
