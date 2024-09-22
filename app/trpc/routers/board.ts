import { observable } from '@trpc/server/observable';
import { EventEmitter } from 'node:events';
import { trpcRoot } from '~/trpc/server';
import { z } from 'zod';
import type { BoardMessage } from '~/types';
import crypto from 'node:crypto';

const ee = new EventEmitter();
const boardStorage: BoardMessage[] = [];
const MAX_MESSAGES = 10_000;

setInterval(() => {
  ee.emit('post', {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    message: 'ALIVE',
  } as BoardMessage);
}, 5000);

export const boardRouter = trpcRoot.router({
  subscribeMessages: trpcRoot.procedure.subscription(() => {
    return observable<BoardMessage>((emit) => {
      const onPosted = (message: BoardMessage) => {
        emit.next(message);
      };
      ee.on('post', onPosted);
      return () => {
        ee.off('post', onPosted);
      };
    });
  }),
  getMessages: trpcRoot.procedure.query(() => {
    return boardStorage;
  }),
  postMessage: trpcRoot.procedure
    .input(
      z.object({
        message: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const newMessage: BoardMessage = {
        id: crypto.randomUUID(),
        message: input.message,
        timestamp: Date.now(),
      };

      const n = boardStorage.unshift(newMessage);
      if (n > MAX_MESSAGES) {
        boardStorage.pop();
      }
      ee.emit('post', newMessage);

      return newMessage;
    }),
});
