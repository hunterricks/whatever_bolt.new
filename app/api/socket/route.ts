import { Server } from 'socket.io';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

const io = new Server({
  path: '/api/socket',
  addTrailingSlash: false,
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('join-chat', (chatId: string) => {
    socket.join(chatId);
    console.log(`Client joined chat: ${chatId}`);
  });

  socket.on('typing', ({ chatId, isTyping }: { chatId: string; isTyping: boolean }) => {
    socket.to(chatId).emit('user-typing', isTyping);
  });

  socket.on('message', ({ chatId, message }) => {
    socket.to(chatId).emit('new-message', message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const headersList = headers();
  const upgrade = headersList.get('upgrade');

  if (upgrade?.toLowerCase() !== 'websocket') {
    return new NextResponse('Expected Websocket', { status: 426 });
  }

  try {
    // @ts-ignore - Next.js types don't include raw yet
    const res = await io.handleUpgrade(request.raw, request.socket);
    return new NextResponse(null, { status: 101 });
  } catch (e) {
    console.error('WebSocket upgrade failed:', e);
    return new NextResponse('WebSocket upgrade failed', { status: 500 });
  }
}