import { mongoConnection } from "./database";
import router from "./routes";
import createServer from "./server";

const server = createServer({
  connections: [mongoConnection],
  router
})

server.listen(3001, () => console.log('Server running!'))
