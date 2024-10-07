
import { Server } from "./server";
let server = new Server().app;
let port = 4444;

server.get('/health', async (req, res) => {
  res.status(200).send({ health: 'ok' });

})

server.listen(port, () => {
  console.log(`Server Listen port :`, port);
  console.log(`Worker PID ${process.pid} started`);
})
