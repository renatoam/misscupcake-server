import { mongoConnection } from "./modules/shared/frameworksDrivers/mongo";
import router from "./modules/shared/main/routes";
import createServer from "./server";

const server = createServer({
  connections: [mongoConnection],
  router
})

server.listen(3001, () => console.log('Server running!'))
