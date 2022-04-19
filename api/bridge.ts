import { useWeb3React } from '@web3-react/core';
import axios from 'axios';
import { resolveBridgeTokenAddress } from 'config/supportedTokens';
import { ethers } from 'ethers';
import { useCallback } from 'react';
import { isValidAddress } from 'utils/address';
import {
  PortalContract,
  useChildPortalContract,
  useRootPortalContract,
} from 'utils/ethers';

/**
 * Locks the amount in rinkeby.
 */
export function useLockAmountToRinkeby() {
  const { account } = useWeb3React();
  const rootPortal = useRootPortalContract();

  return useCallback(
    async (token: string, amount: string) => {
      if (!rootPortal || !account) {
        return;
      }

      return await rootPortal.send(token, account, amount);
    },
    [account, rootPortal]
  );
}

/**
 * Brigdes the token that has been locked at Rinkeby to Theta Testnet.
 */
export async function bridgeToTheta(transactionHash: string) {
  const response = await axios.post('/api/bridge-to-theta', {
    transactionHash,
  });
  return response.data.hash;
}

/**
 * Burns the amount in Theta before unlocking it in Rinkeby.
 */
export function useBurnAmountInTheta() {
  const { account } = useWeb3React();
  const childPortal = useChildPortalContract();

  return useCallback(
    async (token: string, amount: string) => {
      if (!childPortal || !account) {
        return;
      }

      return await childPortal.withdraw(token, account, amount);
    },
    [account, childPortal]
  );
}

/**
 * Brigdes the token that has been burnt at Theta Testnet to Rinkeby.
 */
export async function bridgeToRinkeby(transactionHash: string) {
  const response = await axios.post('/api/bridge-to-rinkeby', {
    transactionHash,
  });
  return response.data.hash;
}

/**
 * Gets the bridge data for a given id.
 */
export async function getBridgeData(portal: PortalContract, bridgeId: string) {
  const [tokenAddress, transferredBy, transferredTo, transferredAmount] =
    await Promise.all([
      portal.tokenAddress(bridgeId),
      portal.transferredBy(bridgeId),
      portal.transferredTo(bridgeId),
      portal.transferredAmount(bridgeId),
    ]);

  // If there is no such bridge request id and its associated data on Rinkeby, then
  // the bridge request is invalid.
  if (
    !isValidAddress(tokenAddress) ||
    !isValidAddress(transferredBy) ||
    !isValidAddress(transferredTo) ||
    !ethers.BigNumber.from(transferredAmount).isZero
  ) {
    console.error('The bridge id not found.');
    return null;
  }

  // Get the address of the token in the other network.
  const bridgeTokenAddress = resolveBridgeTokenAddress(tokenAddress);
  if (!bridgeTokenAddress) {
    console.error('Token address not supported to be bridged.');
    return null;
  }

  return {
    tokenAddress,
    transferredBy,
    transferredTo,
    transferredAmount,
    bridgeTokenAddress,
  };
}
