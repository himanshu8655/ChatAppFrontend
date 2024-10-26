import { io, Socket } from 'socket.io-client';
import { getToken } from '../api/auth';

let socket: Socket | null = null;
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const connectSocket = async () => {
  const token = await getToken();
  console.log(token)
  socket = io(API_URL, {
    auth: {
      token,
    },
  });

  return socket;
};

export const getSocket = () => socket;
