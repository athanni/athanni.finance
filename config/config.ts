import { Network } from './constants';

const NETWORK = process.env.NEXT_PUBLIC_NETWORK!;

const config = {
  NETWORK,
  EXPLORER_URL:
    NETWORK === Network.Theta
      ? 'https://testnet-explorer.thetatoken.org/'
      : 'https://polygonscan.com/',
  ROUTER_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_ROUTER_CONTRACT_ADDRESS!,
};

if (
  !config.ROUTER_CONTRACT_ADDRESS ||
  ![Network.Theta, Network.Polygon].includes(config.NETWORK as any)
) {
  throw new Error('Environment variables not configured');
}

/**
 * Generate a transaction explorer URL.
 */
export function explorerTransactionUrl(txId: string): string {
  return `${config.EXPLORER_URL}${
    config.NETWORK === Network.Theta ? 'txs' : 'tx'
  }/${txId}`;
}

export default config;
