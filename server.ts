import express, { Request, Response } from 'express';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import cors from 'cors';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000", // to enable CORS for the frontend
    methods: ["GET", "POST"]
  }
});
const port = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());

// Sample route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, world!');
});

let connectedUsers = []
io.on('connection', (socket) => {
  console.log('a user connected, ' + socket.id);

  socket.on('private_message', (data) => {
    const { recipientId, message } = data;
    // Send the message only to the recipient
    io.to(recipientId).emit('private_message', {
      message,
      from: socket.id,
    });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
  });


});


// Start the server
httpServer.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
