import BigNumber from 'bignumber.js';
import { resolveToken } from 'config/supportedTokens';
import { ethers } from 'ethers';
import { ChangeEvent } from 'react';

/**
 * A decimal input.
 */
export const decimalRegex = '[0-9]*\\.?[0-9]*';

/**
 * Only allow valid input for an input field. It checks for the validity of the field
 * via regex pattern put into the input field.
 */
export function handleAllowedInput(
  e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  onChange: (...values: any[]) => void,
  oldValue: string
) {
  onChange(e.target.validity.valid ? e.target.value : oldValue);
}

/**
 * Converts a given [amount] in its normal unit to the base unit based on the [token]
 * address.
 */
export function convertAmountToBaseUnit(amount: string, token: string): string {
  const amt = new BigNumber(amount);
  const multiplier = new BigNumber(10).pow(resolveToken(token)!.decimals);
  return amt.multipliedBy(multiplier).integerValue().toFixed();
}

/**
 * Gets the parition number of a given bridge id.
 */
export function partitionOfBridgeId(bridgeId: string): string {
  return ethers.BigNumber.from(bridgeId)
    .add(ethers.BigNumber.from(1).shl(255))
    .toString();
}
