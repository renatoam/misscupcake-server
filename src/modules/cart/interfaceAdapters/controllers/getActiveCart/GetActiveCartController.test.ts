import { Identifier } from "@shared/domain/ports/Identifier";
import { UniqueEntityID } from "@shared/domain/UniqueEntityID";
import { CartUseCase } from "@cart/domain/ports/CartUseCase";
import { Cart } from "@cart/domain/entities/CartEntity";
import { CartItem } from "src/modules/cartItem/domain/CartItemEntity";
import { SimpleCartResponseDTO } from "@cart/domain/entities/CartProps";
import { validateCustomerId } from "@cart/frameworksDrivers/middlewares/getActiveCartMiddleware";
import { NotFoundError, Result } from "@shared/errors";
import { Router } from "express";
import createServer from "src/server";
import request from "supertest";
import { Mock, beforeEach, describe, expect, it, vitest } from "vitest";
import { GetActiveCartController } from "./GetActiveCartController";

const router = Router()
const mongoConnection = vitest.fn()

const getActiveCartUseCaseMock: CartUseCase<string, Cart> = {
  execute: vitest.fn()
}

const getActiveCartController = new GetActiveCartController(getActiveCartUseCaseMock)

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

  const newCartId = new UniqueEntityID('2ac5bbc2-6757-4176-ad0a-8817048c36a7')
  const newCartItem = CartItem.create({ name: 'mockItem' } as any, new UniqueEntityID('40b1e47c-f918-4407-9bca-d458647def10'))
  const newCartProps = {
    accountId: new UniqueEntityID(guestId),
    status: 'active',
    items: [newCartItem.getValue() as any]
  }
  const newCart = Cart.create(newCartProps, newCartId).getValue()

  const useCaseMockOkValue = Result.success(newCart)
  const useCaseMockFailValue = Result.fail(new NotFoundError())
  const useCaseMockMethod = getActiveCartUseCaseMock.execute as Mock

  describe('account ID or guest ID are properly provided', () => {
    it('should return status code 200', async () => {
      useCaseMockMethod.mockResolvedValue(useCaseMockOkValue)
      const response = await request(server)
        .get(`${baseURL}?accountId=${accountId}&guestId=${guestId}`)

      expect(response.status).toBe(200)
    })

    it('should return a content json type in the response', async () => {
      useCaseMockMethod.mockResolvedValue(useCaseMockOkValue)
      const response = await request(server)
        .get(`${baseURL}?accountId=${accountId}&guestId=${guestId}`)

      expect(response.headers['content-type']).toContain('json')
    })

    it('should return the active cart in proper format if it is found', async () => {
      useCaseMockMethod.mockResolvedValue(useCaseMockOkValue)
      const response = await request(server)
        .get(`${baseURL}?accountId=${accountId}&guestId=${guestId}`)
      const result = response.body as SimpleCartResponseDTO

      expect(result.cartId).toBeDefined()
      expect(result.accountId).toBeDefined()
      expect(result.subtotal).toBeDefined()
      expect(result.total).toBeDefined()
      expect(result.items).toBeDefined()
    })

    it('should return status code 404 if no active cart is found', async () => {
      useCaseMockMethod.mockResolvedValue(useCaseMockFailValue)
      const response = await request(server)
        .get(`${baseURL}?accountId=${accountId}&guestId=${guestId}`)

      expect(response.status).toBe(404)
    })

    it('should return status code 404 if no cart at all is found', async () => {
      useCaseMockMethod.mockResolvedValue(useCaseMockFailValue)
      const response = await request(server)
        .get(`${baseURL}?accountId=${accountId}&guestId=${guestId}`)

      expect(response.status).toBe(404)
    })
  })

  describe('guest ID is provided but no account ID', () => {
    it('should return a cart in proper format if guest ID has an active cart associated',
      async () => {
        useCaseMockMethod.mockResolvedValue(useCaseMockOkValue)
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
        useCaseMockMethod.mockResolvedValue(Result.fail(new NotFoundError()))
        const response = await request(server)
          .get(`${baseURL}?guestId=${guestId}`)

        expect(response.status).toBe(404)
      }
    )
  })
  
  describe('account ID is provided but no guest ID', () => {
    const newAccCartProps = { ...newCartProps, accountId: new UniqueEntityID(accountId) }
    const newCart = Cart.create(newAccCartProps, newCartId).getValue()
    const successMockValue = Result.success(newCart)

    it('should return a cart in proper format if account ID has an active cart associated',
      async () => {
        useCaseMockMethod.mockResolvedValue(successMockValue)
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
        useCaseMockMethod.mockResolvedValue(Result.fail(new NotFoundError()))
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
          accountId: new UniqueEntityID(accountId),
          status: newCart.status,
          items: newCart.items
        }, new Identifier(123456)).getValue()
        
        useCaseMockMethod
          .mockResolvedValueOnce(useCaseMockOkValue)
          .mockResolvedValueOnce(Result.success(alternativeCart))
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
      const newAccCartProps = { ...newCartProps, accountId: new UniqueEntityID(accountId) }
      const newCart = Cart.create(newAccCartProps, newCartId).getValue()
      const successMockValue = Result.success(newCart)

      it('should use the provided account ID as the cart account ID', async () => {
        useCaseMockMethod
          .mockResolvedValueOnce(successMockValue)
          .mockResolvedValueOnce(successMockValue)
        const response = await request(server)
          .get(`${baseURL}?accountId=${accountId}&guestId=${guestId}`)
        const result = response.body as SimpleCartResponseDTO

        expect(result.accountId).toBe(accountId)
      })
    })
  })
})
