import config from './config';
import { Network } from './constants';
import polygonTokens from './polygonTokens.json';
import thetaTokens from './thetaTokens.json';

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
};

/**
 * The tokens that are first party within the app.
 */
const supportedTokens: Token[] =
  config.NETWORK === Network.Theta ? thetaTokens : polygonTokens;

/**
 * A map of all the supported tokens.
 */
export const tokenMap = supportedTokens.reduce((acc, cur) => {
  acc[cur.address] = cur;
  return acc;
}, {} as { [key: string]: Token });

export default supportedTokens;
