import { defineConfig } from '@tanstack/start/config';
import type { Router } from 'vinxi/dist/types/lib/router-mode';
import tsConfigPaths from 'vite-tsconfig-paths';

const app = defineConfig({
  deployment: { preset: 'node-server' },
  vite: {
    plugins: () => [
      tsConfigPaths({
        projects: ['./tsconfig.json'],
      }),
    ],
  },
});

app.config.server.experimental = { websocket: true, asyncContext: true };

app.addRouter({
  name: 'websocket',
  type: 'http',
  handler: './app/ws.ts',
  target: 'server',
  base: '/_ws',
} as Router);
app.addRouterPlugins(
  ({ name }) => name === 'websocket',
  () => [
    tsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
  ],
);

export default app;
