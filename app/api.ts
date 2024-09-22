import { defaultAPIFileRouteHandler } from '@tanstack/start/api';
import { toWebRequest, defineEventHandler } from 'vinxi/http';
import { handleTRPCRequest } from '~/trpc/handler';

export default defineEventHandler(async (event) => {
  const request = toWebRequest(event);
  const ctx = { request };

  if (event.web?.url) {
    const url = event.web.url;

    // In case we're using tRPC HttpLink
    // if (url.pathname.startsWith('/api/trpc')) {
    //   return handleTRPCRequest(ctx);
    // }
  }

  return defaultAPIFileRouteHandler(ctx);
});
