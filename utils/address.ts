import { ethers } from 'ethers';

/**
 * Checks if the address is actually valid and also not a zero address.
 */
export function isValidAddress(address: string): boolean {
  return (
    ethers.utils.isAddress(address) && address !== ethers.constants.AddressZero
  );
}
