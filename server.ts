const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Replace with your React app's URL
    methods: ["GET", "POST"]
  }
});

app.use(cors());

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('joinRoom', ({ username, room }) => {
    socket.join(room);
    console.log(`${username} joined room: ${room}`);

    // Notify others in the room
    socket.to(room).emit('message', {
      user: 'admin',
      text: `${username} has joined the room`
    });

    // Handle sending messages
    socket.on('sendMessage', (message, callback) => {
      io.to(room).emit('message', { user: username, text: message });
      callback();
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      io.to(room).emit('message', {
        user: 'admin',
        text: `${username} has left the room`
      });
    });
  });
});

server.listen(5000, () => {
  console.log('Server is running on port 5000');
});
