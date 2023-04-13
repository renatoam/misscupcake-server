import cors from "cors";
import dotenv from "dotenv";
import Express, { Response, Router } from "express";

interface AppProps {
  connections: Function[]
  router: Router
}

function app({ connections, router }: AppProps) {
  let corsOrigin = process.env.CLIENT_URL

  if (process.env.NODE_ENV !== 'production') {
    dotenv.config()
    corsOrigin = "*"
  }

  connections.forEach(connect => {
    connect()
  })

  const server = Express()

  server.use(Express.json())
  server.use(cors({
    origin: corsOrigin
  }))

  server.use('/api/v1', router)

  server.use((_, response: Response) => {
    return response.status(404).send('There is nothing here. Try "/products"')
  })
  
  return server
}

export default app
