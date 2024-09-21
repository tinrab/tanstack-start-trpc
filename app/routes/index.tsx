import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/start';
import { trpc } from '~/trpc/client';

const getEnv = createServerFn('GET', async () => {
  return {
    env: process.env.NODE,
  };
});

function getHelloQueryOptions(host: string) {
  return queryOptions({
    queryKey: ['hello'],
    queryFn: async ({ signal }) => {
      const data = await fetch(`${host}/api/hello`, { signal }).then((res) =>
        res.json(),
      );
      return data;
    },
  });
}

export const Route = createFileRoute('/')({
  component: Home,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(
      getHelloQueryOptions(context.host),
    );
    return {
      host: context.host,
      env: await getEnv(),
    };
  },
});

function Home() {
  const data = Route.useLoaderData();
  const version = useSuspenseQuery(getHelloQueryOptions(data.host));

  const trpcHello = trpc.hello.useQuery();

  return (
    <main className="mx-auto flex min-h-screen max-w-screen-lg flex-col px-4 py-8">
      <pre className="mb-4">{JSON.stringify(data, null, 2)}</pre>
      <pre className="mb-4">{JSON.stringify(version.data, null, 2)}</pre>
      <pre className="mb-4">{JSON.stringify(trpcHello.data, null, 2)}</pre>
    </main>
  );
}
