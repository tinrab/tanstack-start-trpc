import { initTRPC } from '@trpc/server';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

const t = initTRPC.create();

const appRouter = t.router({
  hello: t.procedure.query(() => 'Hello, tRPC!'),
});

export type AppRouter = typeof appRouter;

export function handleTRPCRequest(ctx: { request: Request }) {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: ctx.request,
    router: appRouter,
    createContext() {
      return {};
    },
  });
}
