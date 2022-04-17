import config from 'config/config';
import { RINKEBY_CHAIN_ID } from 'config/constants';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

/**
 * Gets the correct chain id for the app based on the URL context.
 */
export function useCorrectChainId() {
  const { pathname } = useRouter();
  // The chain id to connect depends upon which page is open. If the bridge deposit
  // page is open, then it must be connected to Rinkeby else Theta Testnet.
  return useMemo(
    () => (pathname === '/bridge/deposit' ? RINKEBY_CHAIN_ID : config.CHAIN_ID),
    [pathname]
  );
}
