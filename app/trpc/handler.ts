import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '~/trpc/routers';

export function handleTRPCRequest(ctx: { request: Request }) {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: ctx.request,
    router: appRouter,
    allowBatching: false,
    createContext() {
      return {};
    },
  });
}
