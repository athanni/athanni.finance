import { CssBaseline, ThemeProvider } from '@mui/material';
import { Web3ReactProvider } from '@web3-react/core';
import theme from 'config/theme';
import { ethers, Wallet } from 'ethers';
import { NextSeo } from 'next-seo';
import type { AppProps } from 'next/app';

/**
 * Constructs the Web3 instance for use with the web3-react lib.
 */
function getLibrary(provider: any) {
  return new ethers.providers.Web3Provider(provider);
}

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
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
    </Web3ReactProvider>
  );
}
