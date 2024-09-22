import { createWSClient, httpLink, splitLink, wsLink } from '@trpc/client';
import { createTRPCQueryUtils, createTRPCReact } from '@trpc/react-query';
import { queryClient } from '~/query-client';
import type { AppRouter } from '~/trpc/routers';

export const trpc = createTRPCReact<AppRouter>({});

const wsClient = createWSClient({
  url: `ws://localhost:${process.env.PORT ?? 3000}/_ws`,
});

export const trpcClient = trpc.createClient({
  links: [
    wsLink({
      client: wsClient,
    }),
    // A split link can be used instead.
    // The way Vinxi/Vite bundling works, the WS part will be bundled separately than HTTP handlers.
    // For this example, tRPC subscription with an EventEmitter won't work, because the build will contain two separate emitter instances.
    //
    // For enabling HttpLink, check `~/api.ts`.
    // splitLink({
    //   condition: (op) => op.type === 'subscription',
    //   true: wsLink({
    //     client: wsClient,
    //   }),
    //   false: httpLink({
    //     url: 'http://localhost:3000/api/trpc',
    //   }),
    // }),
  ],
});

export const trpcQueryUtils = createTRPCQueryUtils({
  queryClient,
  client: trpcClient,
});
