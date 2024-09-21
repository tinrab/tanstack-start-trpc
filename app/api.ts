import { defaultAPIFileRouteHandler } from '@tanstack/start/api';
import { toWebRequest, defineEventHandler } from 'vinxi/http';
import { handleTRPCRequest } from '~/trpc/handler';

export default defineEventHandler(async (event) => {
  const request = toWebRequest(event);
  const ctx = { request };

  const url = new URL(ctx.request.url);
  if (url.pathname.startsWith('/api/trpc')) {
    return handleTRPCRequest(ctx);
  }

  return defaultAPIFileRouteHandler(ctx);
});
