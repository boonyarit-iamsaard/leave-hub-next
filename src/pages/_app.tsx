import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { NotificationsProvider } from '@mantine/notifications';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { type AppType } from 'next/app';
import Head from 'next/head';

import { Layout } from '../components/layout';
import { RouterTransition } from '../components/RouterTransition';
import { theme } from '../styles/theme';
import { emotionCache } from '../utils/emotion-cache';
import { trpc } from '../utils/trpc';

import '../styles/globals.css';

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Leave Hub | Bangkok Engineering</title>
        <meta
          name="description"
          content="Leave management system for Bangkok engineering"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MantineProvider
        emotionCache={emotionCache}
        withGlobalStyles
        withNormalizeCSS
        theme={theme}
      >
        <RouterTransition />
        <NotificationsProvider>
          <ModalsProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ModalsProvider>
        </NotificationsProvider>
      </MantineProvider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
