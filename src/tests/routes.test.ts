import { describe, expect, it } from "vitest"
import request from "supertest"
import server from "../server"

describe('Product Routes', () => {
  it('should return a valid product', async () => {
    const response = await request(server).get('/api/products')

    expect(response.body[0].name).toBe('Pink Strawberry')
  })

  it('should return a valid product by passing a valid field', async () => {
    const response = await request(server).get('/api/products?field=id')

    expect(response.body[0].id).toBe('b0d94dbd-1675-4fc5-bbb6-b13396d73fec')
  })

  it('should return an error by passing an invalid field', async () => {
    const response = await request(server).get('/api/products?field=invalidField')

    console.log(response.body)

    expect(response.body.message).toBe('Server Error')
  })
})
