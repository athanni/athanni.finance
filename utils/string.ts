/**
 * Shorterns the ethereum address.
 */
export function shorternAddress(address: string): string {
  return `${address.substring(0, 6)}...${address.substring(
    address.length - 5
  )}`;
}
