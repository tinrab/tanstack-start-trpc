import { defineWebSocket, eventHandler } from 'vinxi/http';
import { getWSConnectionHandler } from '@trpc/server/adapters/ws';
import type * as ws from 'ws';
import { appRouter } from '~/trpc/routers';
import type { IncomingMessage } from 'node:http';

type Peer = Parameters<
  NonNullable<ReturnType<typeof defineWebSocket>['open']>
>[0];

function toWebSocketClient(peer: Peer): [ws.WebSocket, IncomingMessage] {
  if ('node' in peer.ctx) {
    return [peer.ctx.node.ws, peer.ctx.node.req];
  }
  throw new Error('unknown peer context');
}

const onConnection = getWSConnectionHandler({
  router: appRouter,
  createContext() {
    return {};
  },
});

export default eventHandler({
  handler: () => {},
  websocket: defineWebSocket({
    async open(peer) {
      const [client, req] = toWebSocketClient(peer);
      onConnection(client, req);
    },
    // async message(peer, message) {},
    // async close(peer) {},
  }),
});
