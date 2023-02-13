import Express from "express";
import router from "./routes";

const server = Express()

server.use('/api', router)

server.listen(3001, () => console.log('Server running!'))
