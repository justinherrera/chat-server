import express, { Request, Response } from 'express';
import { Server } from 'socket.io';
import { createServer } from 'node:http';

const app = express();
const server = createServer(app);
const io = new Server(server);
const port = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());

// Sample route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, world!');
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
