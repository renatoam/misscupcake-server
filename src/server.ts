import cors from "cors";
import dotenv from "dotenv";
import Express, { Router } from "express";
import { createServer } from "http";
// import { Server } from 'socket.io'

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

  const express = Express()

  express.use(Express.json())
  express.use(cors({
    origin: corsOrigin
  }))

  express.use('/missapi/v1', router)

  express.use(Express.static('public'))

  const server = createServer(express)
  // const io = new Server(server, {
  //   cors: {
  //     origin: "*"
  //   }
  // })

  // io.on('connection', (socket) => {
  //   console.log('User connected: ', socket.id)
    
  //   socket.on('disconnect', () => {
  //     console.log('User disconnected: ', socket.id)
  //   })

  //   socket.on('message', message => {
  //     console.log('Received', message)
  //     // socket.broadcast.emit('message', message)
  //   })
  // })
  
  return server
}

export default app
