import BigNumber from 'bignumber.js';

/**
 * Calculate the minimum value that a price can slip to.
 * @param price A price of a token.
 * @param slippageRate A percentage with which price can slip.
 */
export function calculateSlippageMin(
  price: BigNumber,
  slippageRate: number
): BigNumber {
  if (slippageRate < 0 || slippageRate > 1) {
    throw new Error('Invalid slippage rate');
  }

  return price
    .multipliedBy(new BigNumber(1).minus(slippageRate))
    .integerValue();
}

/**
 * Calculate the maximum value that a price can slip to.
 * @param price A price of a token.
 * @param slippageRate A percentage with which price can slip.
 */
export function calculateSlippageMax(
  price: BigNumber,
  slippageRate: number
): BigNumber {
  if (slippageRate < 0 || slippageRate > 1) {
    throw new Error('Invalid slippage rate');
  }

  return price.multipliedBy(new BigNumber(1).plus(slippageRate)).integerValue();
}
