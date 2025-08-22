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
  if (!cb) return new Error('Cors error.')
  
  if (!origin?.includes(process.env.CLIENT_URL ?? '') || !origin) {
    return cb(null, { origin: true })
  }
  
  cb(new Error('CORS error: origin not allowed.'), { origin: false })
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
  express.use('/health', (_, res) => res.send('Miss API is running.'))

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
