/**
 * Shorterns the ethereum address.
 */
export function shorternAddress(address: string): string {
  return `${address.substring(0, 8)}...${address.substring(
    address.length - 7
  )}`;
}
