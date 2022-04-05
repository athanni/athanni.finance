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
const supportedTokens: Token[] = [
  {
    address: '0x09d1fF723D83C40e551e1AEd7C1225dc301B0615',
    name: 'Tokener',
    ticker: 'TOK',
    decimals: 18,
    logoUrl: '',
  },
  {
    address: '0x7d674C5857a0401C67cb7bC3244Aa23872c68277',
    name: 'Macaloo',
    ticker: 'MAC',
    decimals: 18,
    logoUrl: '',
  },
  {
    address: '0xe2F2ecc2f32FC85f20DA25A6495C11fbbe57F9F0',
    name: 'Minter',
    ticker: 'MIN',
    decimals: 18,
    logoUrl: '',
  },
  {
    address: '0x7fA99f197c8EA70C6FE319749CBfBEDe83045abB',
    name: 'People',
    ticker: 'PEP',
    decimals: 18,
    logoUrl: '',
  },
  {
    address: '0xb07740b2E912bAb17C13Ded4DCD42F143a4e847a',
    name: 'Athanni',
    ticker: 'ATH',
    decimals: 18,
    logoUrl: '',
  },
  {
    address: '0x6C59E964bF017041aD755bBADBa7C6DF712D890E',
    name: 'My Hardhat Token',
    ticker: 'MHT',
    decimals: 18,
    logoUrl: '',
  },
];

/**
 * A map of all the supported tokens.
 */
export const tokenMap = supportedTokens.reduce((acc, cur) => {
  acc[cur.address] = cur;
  return acc;
}, {} as { [key: string]: Token });

export default supportedTokens;
