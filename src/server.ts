import cors from "cors";
import dotenv from "dotenv";
import Express, { Response } from "express";
import { mongoConnection } from "./database";
import router from "./routes";

let corsOrigin = process.env.CLIENT_URL

if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
  corsOrigin = "*"
}

mongoConnection()

const server = Express()

server.use(Express.json())
server.use(cors({
  origin: corsOrigin
}))

server.use('/api/v1', router)

server.use((_, response: Response) => {
  return response.status(404).send('There is nothing here. Try "/products"')
})

export default server
