import type { Socket } from 'socket.io-client';
import { create } from 'zustand';
import type { DefaultEventsMap } from 'socket.io';

export type SocketState = {
  socket?: Socket;
  setSocket: (
    newSocket: Socket<
      DefaultEventsMap,
      DefaultEventsMap
    > | null,
  ) => void;
};

export const useSocketStore = create<SocketState>(
  (set) => ({
    socket: null,
    setSocket: (
      newSocket: Socket<
        DefaultEventsMap,
        DefaultEventsMap
      > | null,
    ) => {
      set({ socket: newSocket });
    },
  }),
);
