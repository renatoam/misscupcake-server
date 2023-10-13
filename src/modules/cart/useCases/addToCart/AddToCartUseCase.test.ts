import { UniqueEntityID } from "@shared/domain/UniqueEntityID";
import { Cart } from "@cart/domain/entities/CartEntity";
import { CartItem } from "src/modules/cartItem/domain/CartItemEntity";
import { SimpleCartResponseDTO } from "@cart/domain/entities/CartProps";
import { CartRepository } from "@cart/domain/ports/CartRepository";
import { ProductRepository } from "@product/domain/ports/ProductRepository";
import { ClientError, Result } from "@shared/errors";
import { Mock, describe, expect, it, vitest } from "vitest";
import { AddToCartUseCase } from "./AddToCartUseCase";
import { CartItemRepository } from "@cart/frameworksDrivers/cartItem/CartItemRepository";

describe('AddToCartUseCase', () => {
  const cartRepository: CartRepository = {
    getCartsByCustomerId: vitest.fn(),
    getActiveCart: vitest.fn(),
    getAll: vitest.fn(),
    getById: vitest.fn(),
    save: vitest.fn(),
    delete: vitest.fn(),
  }
  
  const cartItemRepository: CartItemRepository = {
    getItemsByCartId: vitest.fn(),
    saveMany: vitest.fn(),
    getAll: vitest.fn(),
    getById: vitest.fn(),
    save: vitest.fn(),
    delete: vitest.fn()
  }

  const productRepository: ProductRepository = {
    getAll: vitest.fn(),
    getFeatured: vitest.fn(),
    getProductsByIdInBulk: vitest.fn(),
    getById: vitest.fn(),
    save: vitest.fn(),
    delete: vitest.fn(),
  }

  const getProductInBulkMock = productRepository.getProductsByIdInBulk as Mock
  const saveMock = cartRepository.save as Mock

  const mockProductId = new UniqueEntityID().toString()
  const mockProductQuantity = 10
  const mockProduct = { id: '1', productId: mockProductId, quantity: mockProductQuantity, images: [''] }

  getProductInBulkMock.mockReturnValue(Result.success([mockProduct]))
  
  it('should create a new cart with the given products', async () => {
    const accountId = new UniqueEntityID()
    const mockCartItem = CartItem.create({
      image: '',
      name: 'mock',
      quantity: 5,
      unitPrice: 10,
      productId: '123'
    })
    const mockCart = Cart.create({ accountId, status: 'active', items: [mockCartItem.getValue()] })
    saveMock.mockReturnValue(Result.success(mockCart.getValue()))
    const products = [mockProduct]
    const addToCartUseCase = new AddToCartUseCase(cartRepository, cartItemRepository, productRepository)
    const newCart = await addToCartUseCase.execute({ accountId: accountId.toString(), products })
    const simpleCartFormat: SimpleCartResponseDTO = {
      cartId: "",
      accountId: "",
      subtotal: 0,
      total: 0,
      items: []
    }

    expect(newCart.getValue()).toBeTruthy()

    for (const key in simpleCartFormat) {
      expect(newCart.getValue()).toHaveProperty(key)
    }
  })

  it('should not allow to create cart with no products', async () => {
    const accountId = new UniqueEntityID().toString()
    const addToCartUseCase = new AddToCartUseCase(cartRepository, cartItemRepository, productRepository)
    const newCart = await addToCartUseCase.execute({ accountId, products: [] })

    expect(newCart.isError()).toBe(true)
    expect(newCart.getError()).toBeInstanceOf(ClientError)
  })
})
