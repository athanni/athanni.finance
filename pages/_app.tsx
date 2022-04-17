import { CssBaseline, GlobalStyles, ThemeProvider } from '@mui/material';
import { grey } from '@mui/material/colors';
import { Web3ReactProvider } from '@web3-react/core';
import theme from 'config/theme';
import { NextSeo } from 'next-seo';
import type { AppProps } from 'next/app';
import { SnackbarProvider } from 'notistack';
import { QueryClient, QueryClientProvider } from 'react-query';
import { hooks, metaMask } from 'utils/metamask';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Web3ReactProvider connectors={[[metaMask, hooks]]}>
        <NextSeo
          title="Athanni Finance"
          description="A fast and cheap non-custodial token swap on Theta Network."
          additionalMetaTags={[
            {
              name: 'viewport',
              content: 'initial-scale=1, width=device-width',
            },
          ]}
        />
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SnackbarProvider>
            <Component {...pageProps} />
          </SnackbarProvider>

          <GlobalStyles
            styles={`
            body {
              background-color: ${grey[50]};
            }
          `}
          />
        </ThemeProvider>
      </Web3ReactProvider>
    </QueryClientProvider>
  );
}
