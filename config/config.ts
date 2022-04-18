import { THETA_TESTNET_EXPLORER_URL } from './constants';

const config = {
  ROUTER_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_ROUTER_CONTRACT_ADDRESS!,
  CHILD_PORTAL_ADDRESS: process.env.NEXT_PUBLIC_CHILD_PORTAL_ADDRESS!,
  ROOT_PORTAL_ADDRESS: process.env.NEXT_PUBLIC_ROOT_PORTAL_ADDRESS!,
};

if (
  !config.ROUTER_CONTRACT_ADDRESS ||
  !config.CHILD_PORTAL_ADDRESS ||
  !config.ROOT_PORTAL_ADDRESS
) {
  throw new Error('Environment variables not configured');
}

/**
 * Generate a transaction explorer URL.
 */
export function explorerTransactionUrl(
  txId: string,
  explorerUrl = THETA_TESTNET_EXPLORER_URL
): string {
  return `${explorerUrl}txs/${txId}`;
}

export default config;
