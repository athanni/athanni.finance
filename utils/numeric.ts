import BigNumber from 'bignumber.js';
import { ChangeEvent } from 'react';

/**
 * Input handler that only accepts decimal input.
 */
export function handleDecimalInput(
  e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  onChange: (...values: any[]) => void
) {
  const hasSucceedingDot = e.target.value.endsWith('.');
  // The user may try to add one more dot after a dot. Ignores the second dot and protects
  // the input from being reset to 0.
  const hasSucceedingDoubleDot = e.target.value.endsWith('..');
  // To check if a dot is already within the number so there can be no second dot.
  const containsDotBefore = e.target.value
    .substring(0, e.target.value.length - (hasSucceedingDoubleDot ? 2 : 1))
    .includes('.');

  // Prune any dots from the end so that number does not fail to parse and reset to 0.
  let value = e.target.value;
  if (hasSucceedingDot || hasSucceedingDoubleDot) {
    value = value.replace(/\.+$/, '');
  }
  const num = new BigNumber(value);

  if (num.isNaN()) {
    return onChange('0');
  }

  // Only allow one decimal point within the input.
  if (!containsDotBefore && (hasSucceedingDot || hasSucceedingDoubleDot)) {
    return onChange(`${num.toString()}.`);
  }

  return onChange(num.toString());
}
