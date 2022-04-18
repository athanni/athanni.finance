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
  network: Network.ThetaTestnet,
}));
export const rinkebyTokens = ethereumTokens.map((it) => ({
  ...it,
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
export const tokenMap = supportedTokens.reduce((acc, cur) => {
  acc[cur.address] = cur;
  return acc;
}, {} as { [key: string]: Token });

export default supportedTokens;
