import { json } from '@tanstack/start';
import { createAPIFileRoute } from '@tanstack/start/api';

export const Route = createAPIFileRoute('/api/hello')({
  GET: () => {
    return json({ message: 'Hello /api/hello' });
  },
});
