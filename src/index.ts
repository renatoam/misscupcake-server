import Express from "express";
import router from "./routes";
import dotenv from "dotenv"

dotenv.config()

const server = Express()

server.get('/', (_, res) => {
  return res.send('There is nothing here. Try "/products"')
})

server.use('/api', router)

server.listen(3001, () => console.log('Server running!'))
