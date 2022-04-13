import { THETA_DEFAULT_DEADLINE_FROM_NOW } from 'config/constants';
import { ethers } from 'ethers';

/**
 * Gets the deadline from now in seconds from unix epoch.
 */
export function deadlineFromNow(): string {
  return ethers.BigNumber.from(THETA_DEFAULT_DEADLINE_FROM_NOW)
    .add(ethers.BigNumber.from(Date.now()).div(1000))
    .toString();
}
