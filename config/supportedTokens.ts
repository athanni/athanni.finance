import ethereumTokens from './rinkebyTokens.json';
import thetaTokens from './thetaTestnetTokens.json';

/**
 * A token metadata type.
 */
export type Token = {
  /**
   * The address where this token TNT-20 contract is deployed to.
   */
  address: string;
  /**
   * The name of the token.
   */
  name: string;
  /**
   * The ticker name of the token.
   */
  ticker: string;
  /**
   * The number of decimals of the token.
   */
  decimals: number;
  /**
   * The logo of the token.
   */
  logoUrl: string;
  /**
   * The network of the token.
   */
  network: Network;
};

/**
 * The network of the token.
 */
export enum Network {
  ThetaTestnet = 'thetaTestnet',
  Rinkeby = 'rinkeby',
}

export const thetaTestnetTokens = thetaTokens.map((it) => ({
  ...it,
  address: it.address.toLowerCase(),
  network: Network.ThetaTestnet,
}));
export const rinkebyTokens = ethereumTokens.map((it) => ({
  ...it,
  address: it.address.toLowerCase(),
  network: Network.Rinkeby,
}));

/**
 * The tokens that are first party within the app.
 * Note: Do not expect that the tokens in two separate network will have same address.
 */
const supportedTokens: Token[] = [...thetaTestnetTokens, ...rinkebyTokens];

/**
 * A map of all the supported tokens.
 */
const tokenMap = supportedTokens.reduce((acc, cur) => {
  acc[cur.address] = cur;
  return acc;
}, {} as { [key: string]: Token });

/**
 * Gets the token from an address.
 */
export function resolveToken(address: string): Token | null {
  return tokenMap[address.toLowerCase()] ?? null;
}

/**
 * A translation of tokens from one network to the other.
 */
const bridgeMap = supportedTokens.reduce((acc, cur) => {
  acc[cur.address] = supportedTokens.find(
    (it) => it.ticker === cur.ticker && it.address !== cur.address
  )!.address;
  return acc;
}, {} as { [key: string]: string });

/**
 * Resolves the token address on a different network after a token is bridged.
 */
export function resolveBridgeTokenAddress(address: string): string | null {
  return bridgeMap[address.toLowerCase()] ?? null;
}

export default supportedTokens;
