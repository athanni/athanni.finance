import BigNumber from 'bignumber.js';
import { tokenMap } from 'config/supportedTokens';
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
  const multiplier = new BigNumber(10).pow(tokenMap[token].decimals);
  return amt.multipliedBy(multiplier).integerValue().toFixed();
}
