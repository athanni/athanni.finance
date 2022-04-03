/**
 * A token metadata type.
 */
type Token = {
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
   * The logo of the token.
   */
  logoUrl: string;
};

/**
 * The tokens that are first party within the app.
 */
const tokens: Token[] = [];

export default tokens;
