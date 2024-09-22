import * as React from 'react';
import { createRootRouteWithContext } from '@tanstack/react-router';
import { Outlet, ScrollRestoration } from '@tanstack/react-router';
import { Body, Head, Html, Meta, Scripts } from '@tanstack/start';
import type { RouterContext } from '~/router';

import mainCss from '~/styles/main.css?url';

export const Route = createRootRouteWithContext<RouterContext>()({
  meta: () => [
    {
      charSet: 'utf-8',
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      title: 'TanStack Start - tRPC',
    },
  ],
  links: () => [{ rel: 'stylesheet', href: mainCss }],
  component: RootComponent,
  notFoundComponent: () => (
    <div>
      <h1>404</h1>
    </div>
  ),
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <Html>
      <Head>
        <Meta />
      </Head>
      <Body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </Body>
    </Html>
  );
}
