import { io, Socket } from 'socket.io-client';
import { useEffect, useRef } from 'react';

let socket: Socket | null = null;

export const initializeSocket = () => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000', {
      path: '/api/socket',
      addTrailingSlash: false,
    });
  }
  return socket;
};

export const useSocket = () => {
  const socketRef = useRef(socket);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = initializeSocket();
    }

    return () => {
      if (socketRef.current?.connected) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return socketRef.current;
};