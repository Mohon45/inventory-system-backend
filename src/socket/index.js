const { Server } = require('socket.io');

let io;

function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', () => {});

  return io;
}

function getIO() {
  if (!io) {
    // Return a dummy object for serverless environments where socket.io isn't supported
    return {
      emit: () => {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Socket.io: emit called but not initialized');
        }
      },
    };
  }
  return io;
}

module.exports = { initializeSocket, getIO };
