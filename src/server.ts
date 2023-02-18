import Express from "express";
import router from "./routes";
import dotenv from "dotenv"
import cors from "cors"

dotenv.config()

const server = Express()

server.use(cors({
  origin: "*"
}))

server.get('/', (_, res) => {
  return res.send('There is nothing here. Try "/products"')
})

server.use('/api', router)

export default server
