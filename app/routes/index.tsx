import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/start';
import { useState } from 'react';
import { Button } from '~/components/button';
import { Input } from '~/components/input';
import { trpc } from '~/trpc/client';
import type { BoardMessage } from '~/types';

const getEnv = createServerFn('GET', async () => {
  return {
    nodeEnv: process.env.NODE_ENV,
  };
});

export const Route = createFileRoute('/')({
  component: Home,
  loader: async ({ context }) => {
    return {
      env: await getEnv(),
      initialMessages: await context.trpcQueryUtils.board.getMessages.fetch(),
    };
  },
});

function Home() {
  const data = Route.useLoaderData();

  const trpcVersionQuery = trpc.version.useQuery();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<BoardMessage[]>(
    data.initialMessages,
  );

  const postMessage = trpc.board.postMessage.useMutation();
  trpc.board.subscribeMessages.useSubscription(undefined, {
    onData(message) {
      setMessages((prev) => {
        const next = [message, ...prev];
        if (next.length > 100) {
          next.pop();
        }
        return next;
      });
    },
  });

  const handlePost = (event: React.FormEvent) => {
    event.preventDefault();
    void postMessage.mutate({
      message: input,
    });
    setInput('');
  };

  return (
    <main className="p-4">
      <div>
        <pre>{JSON.stringify({ env: data.env }, null, 2)}</pre>
      </div>
      <div className="my-4">
        <h1 className="mb-2 text-2xl">Message Board</h1>
        <h2 className="mb-2 text-xl">Version {trpcVersionQuery.data}</h2>

        <div className="border-t-2 p-4">
          <form className="flex flex-row gap-2" onSubmit={handlePost}>
            <Input
              placeholder="Type something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button type="submit">Post</Button>
          </form>
          <ul className="py-4">
            {messages.map((message) => (
              <li className="flex gap-2" key={message.id}>
                <span className="text-muted-foreground">
                  {new Date(message.timestamp).toLocaleString()}
                </span>
                <span>{message.message}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
