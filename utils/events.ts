import { ethers } from 'ethers';

/**
 * The send event and its hash to make sense of the log.
 */
const sendEvent = 'TokenSent(uint256)';
const sendEventHash = ethers.utils.keccak256(sendEvent);

/**
 * The withdraw event and its hash to make sense of the log.
 */
const withdrawEvent = 'TokenWithdrawn(uint256)';
const withdrawEventHash = ethers.utils.keccak256(withdrawEvent);

/**
 * Decodes the bridge id from the executed transaction.
 */
export function decodeBrigeId(
  receipt: ethers.providers.TransactionReceipt
): string | null {
  const log = receipt.logs.find((log) =>
    log.topics.some(
      (topic) => topic === sendEventHash || topic === withdrawEventHash
    )
  );

  if (!log) {
    return null;
  }

  const [bridgeId] = ethers.utils.defaultAbiCoder.decode(['uint256'], log.data);
  return bridgeId;
}
