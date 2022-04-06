import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';

/**
 * Calculate the minimum value that a price can slip to.
 * @param price A price of a token.
 * @param slippageRate A percentage with which price can slip.
 */
export function calculateSlippageMin(
  price: ethers.BigNumber,
  slippageRate: number
): ethers.BigNumber {
  if (slippageRate < 0 || slippageRate > 1) {
    throw new Error('Invalid slippage rate');
  }

  const p = new BigNumber(price.toString());
  const slipped = p.multipliedBy(new BigNumber(1).minus(slippageRate));
  return ethers.BigNumber.from(slipped.toFixed());
}
