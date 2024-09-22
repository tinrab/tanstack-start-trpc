import { boardRouter } from '~/trpc/routers/board';
import { trpcRoot } from '~/trpc/server';

export const appRouter = trpcRoot.router({
  version: trpcRoot.procedure.query(() => 'v1'),
  board: boardRouter,
});

export type AppRouter = typeof appRouter;
