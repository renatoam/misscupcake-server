import cors from "cors";
import dotenv from "dotenv";
import Express, { Response, Router } from "express";

interface AppProps {
  connections: Function[]
  router: Router
}

function checkOrigin(origin?: string, cb?: Function) {
  if (!origin || !cb) return
  if (origin?.includes(process.env.CLIENT_URL ?? '')) cb(null, { origin: true } as any)
  else cb(Error('CORS error: origin not allowed.', { origin: false } as any))
}

function app({ connections, router }: AppProps) {
  let corsOrigin: cors.CorsOptions['origin'] = checkOrigin

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

  server.use('/missapi/v1', router)

  server.use((_, response: Response) => {
    return response.status(404).send('There is nothing here. Try "/products"')
  })
  
  return server
}

export default app
