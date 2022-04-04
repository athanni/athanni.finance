import { ChangeEvent } from 'react';

/**
 * Input handler that only accepts decimal input.
 */
export function handleDecimalInput(
  e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  onChange: (...values: any[]) => void
) {
  const num = parseFloat(e.target.value);
  const hasSucceedingDot = e.target.value.endsWith('.');
  const containsDotBefore = e.target.value
    .substring(0, e.target.value.length - 1)
    .includes('.');

  if (Number.isNaN(num)) {
    return onChange('0');
  }

  // Only allow one decimal point within the input.
  if (!containsDotBefore && hasSucceedingDot) {
    return onChange(`${num}.`);
  }

  return onChange(`${num}`);
}
