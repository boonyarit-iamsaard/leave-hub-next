import { MantineProvider } from '@mantine/core';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { type AppType } from 'next/app';
import Head from 'next/head';

import { Layout } from '../components/layout';
import '../styles/globals.css';
import { emotionCache } from '../utils/emotion-cache';
import { trpc } from '../utils/trpc';

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
        theme={{
          colorScheme: 'light',
        }}
      >
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </MantineProvider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
