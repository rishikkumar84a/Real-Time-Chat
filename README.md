# Real-Time Chat Application

A WebSocket-based real-time chat application enabling seamless communication between users.

## Features

- **Real-time messaging**: Instant message delivery using WebSocket technology
- **Room-based chat**: Users can join different chat rooms
- **User presence indicators**: See who's online in the current room
- **Typing indicators**: Real-time notification when users are typing
- **Responsive design**: Works on both desktop and mobile devices
- **Secure communication**: WebSocket connections over HTTPS/SSL

## Technology Stack

- **Frontend**: React.js, Socket.IO Client
- **Backend**: Node.js, Express.js
- **Real-time Communication**: Socket.IO

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/real-time-chat.git
cd real-time-chat
```

2. Install dependencies
```
npm install
cd client && npm install
cd ..
```

3. Create a `.env` file in the root directory with the following content:
```
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
```

### Running the Application

#### Development Mode
```
npm run dev
```
This will start both the backend server (port 5000) and the React development server (port 3000) concurrently.

#### Production Build
```
npm run build
npm start
```

## Architecture

The application follows a client-server architecture with WebSocket communication for real-time features:

### Backend
- **Express.js server**: Handles HTTP requests and serves static files
- **Socket.IO server**: Manages WebSocket connections and event-based communication
- **In-memory data store**: Stores user information and messages (can be replaced with a database)

### Frontend
- **React components**: Modular UI components
- **Socket.IO client**: Connects to the WebSocket server for real-time events
- **React hooks**: Manages state and side effects
- **Session storage**: Stores user details between sessions

## WebSocket vs HTTP

This application demonstrates the advantages of WebSocket over traditional HTTP for real-time applications:

| WebSocket | HTTP |
|-----------|------|
| Persistent connection | New connection for each request |
| Bi-directional communication | Primarily client-to-server |
| Low latency communication | Higher latency with polling |
| Event-driven architecture | Request-response pattern |
| Efficient for real-time updates | Less efficient for frequent updates |

## Security Considerations

- The application uses CORS to restrict access to the WebSocket server
- In production, SSL/TLS encryption is used for secure data transmission
- User inputs are validated to prevent injection attacks
- In a production environment, additional security measures like rate limiting should be implemented

## Future Enhancements

- User authentication with JWT
- Persistent message storage with MongoDB or another database
- File sharing capabilities
- End-to-end encryption for private messages
- Notification system for unread messages

## License

This project is licensed under the MIT License - see the LICENSE file for details. 