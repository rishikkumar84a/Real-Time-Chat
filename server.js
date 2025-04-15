const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Socket.io setup with CORS
const io = socketIo(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? false : ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// In-memory data store (replace with a database in production)
const users = {};
const rooms = {
  'general': { users: {}, messages: [] }
};

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  // Handle user joining
  socket.on('join', ({ username, room }) => {
    // Store user info
    users[socket.id] = { 
      id: socket.id, 
      username, 
      room,
      isTyping: false
    };
    
    // Create room if it doesn't exist
    if (!rooms[room]) {
      rooms[room] = { users: {}, messages: [] };
    }
    
    // Add user to room
    rooms[room].users[socket.id] = users[socket.id];
    
    // Join the room
    socket.join(room);
    
    // Notify everyone in the room about the new user
    io.to(room).emit('userJoined', {
      user: users[socket.id],
      users: Object.values(rooms[room].users),
      messages: rooms[room].messages
    });
    
    console.log(`${username} joined ${room}`);
  });
  
  // Handle messages
  socket.on('sendMessage', (message) => {
    const user = users[socket.id];
    
    if (user && user.room) {
      const messageData = {
        id: Date.now().toString(),
        user: {
          id: socket.id,
          username: user.username
        },
        text: message,
        timestamp: new Date().toISOString()
      };
      
      // Store the message
      rooms[user.room].messages.push(messageData);
      
      // Send the message to everyone in the room
      io.to(user.room).emit('message', messageData);
    }
  });
  
  // Handle typing status
  socket.on('typing', (isTyping) => {
    const user = users[socket.id];
    
    if (user && user.room) {
      user.isTyping = isTyping;
      
      // Notify others in the room about typing status
      socket.to(user.room).emit('userTyping', {
        userId: socket.id,
        isTyping
      });
    }
  });
  
  // Handle user disconnection
  socket.on('disconnect', () => {
    const user = users[socket.id];
    
    if (user && user.room) {
      // Remove user from room
      delete rooms[user.room].users[socket.id];
      
      // Notify everyone in the room
      io.to(user.room).emit('userLeft', {
        userId: socket.id,
        users: Object.values(rooms[user.room].users)
      });
      
      console.log(`${user.username} left ${user.room}`);
    }
    
    // Remove user from users object
    delete users[socket.id];
  });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 