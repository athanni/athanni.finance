/**
 * Theta network connection details.
 */
export const THETA_MAINNET_CHAIN_ID = 361;
export const THETA_MAINNET_RPC_URL = 'https://eth-rpc-api.thetatoken.org/rpc';
export const THETA_TESTNET_CHAIN_ID = 365;
export const THETA_TESTNET_RPC_URL =
  'https://eth-rpc-api-testnet.thetatoken.org/rpc';

/**
 * Polygon network connection details.
 */
export const POLYGON_TESTNET_CHAIN_ID = 80001;
export const POLYGON_TESTNET_RPC_URL =
  'https://matic-mumbai.chainstacklabs.com';

/**
 * Ethereum Rinkeby network connection details.
 */
export const RINKEBY_CHAIN_ID = 4;
export const RINKEBY_CHAIN_RPC_URL =
  'https://rinkeby.infura.io/v3/fc540662631c4028a8ca161b8c2e0955';

/**
 * The default deadline for each transaction. Unit is in seconds.
 */
export const THETA_DEFAULT_DEADLINE_FROM_NOW = 60 * 5;

/**
 * A zero value address that points to the void.
 */
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

/**
 * The default price splippage rate of 0.5%.
 */
export const DEFAULT_SPLIPPAGE_RATE = 0.005;

/**
 * The network with which the app can interact.
 */
export enum Network {
  Theta = 'theta',
  Polygon = 'polygon',
}
