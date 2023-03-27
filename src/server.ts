import cors from "cors";
import dotenv from "dotenv";
import Express from "express";
import { mongoConnection } from "./database";
import router from "./routes";

dotenv.config()
mongoConnection()

const server = Express()

server.use(Express.json())
server.use(cors({
  origin: "*"
}))

server.get('/', (_, res) => {
  return res.send('There is nothing here. Try "/products"')
})

server.use('/api', router)

export default server
