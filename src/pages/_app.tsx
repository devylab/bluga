import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactElement, ReactNode } from 'react';
import { StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import type { NextPage } from 'next';
import '@admin/assets/styles/global.css';
import createEmotionCache from '@admin/config/createEmotionCache';

// eslint-disable-next-line @typescript-eslint/ban-types
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
  emotionCache?: EmotionCache;
};

const toasterOptions = {
  style: {
    fontWeight: 500,
  },
};

const queryClient = new QueryClient();
const clientSideEmotionCache = createEmotionCache();

export default function MyApp({ Component, emotionCache = clientSideEmotionCache, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return getLayout(
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <StyledEngineProvider injectFirst>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <Toaster toastOptions={toasterOptions} />
          <Component {...pageProps} />
        </QueryClientProvider>
      </StyledEngineProvider>
    </CacheProvider>,
  );
}
