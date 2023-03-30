import cors from "cors";
import dotenv from "dotenv";
import Express, { Response } from "express";
import { mongoConnection } from "./database";
import router from "./routes";

dotenv.config()
mongoConnection()

const server = Express()

server.use(Express.json())
server.use(cors({
  origin: "*"
}))

server.use('/api', router)

server.use((_, response: Response) => {
  return response.status(404).send('There is nothing here. Try "/products"')
})

export default server
