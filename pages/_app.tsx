import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from 'config/theme';
import { NextSeo } from 'next-seo';
import type { AppProps } from 'next/app';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <NextSeo
        title="Athanni Finance"
        description="A fast and cheap non-custodial token swap on Theta Network."
        additionalMetaTags={[
          { name: 'viewport', content: 'initial-scale=1, width=device-width' },
        ]}
      />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
