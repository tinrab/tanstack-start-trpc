import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { type QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { routerWithQueryClient } from '@tanstack/react-router-with-query';
import { trpc, trpcClient, trpcQueryUtils } from '~/trpc/client';
import { queryClient } from '~/query-client';

export type RouterContext = {
  queryClient: QueryClient;
  trpcQueryUtils: typeof trpcQueryUtils;
  host: string;
};

export function createRouter() {
  return routerWithQueryClient(
    createTanStackRouter({
      routeTree,
      context: {
        queryClient,
        trpcQueryUtils,
        host:
          process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000'
            : 'TODO',
      } satisfies RouterContext,
      defaultPreload: 'intent',
      Wrap: function WrapComponent({ children }) {
        return (
          <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          </trpc.Provider>
        );
      },
    }),
    queryClient,
  );
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
