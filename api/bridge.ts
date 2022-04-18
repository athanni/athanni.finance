import { useWeb3React } from '@web3-react/core';
import axios from 'axios';
import { useCallback } from 'react';
import { useChildPortalContract, useRootPortalContract } from 'utils/ethers';

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
export async function bridgeToTheta(bridgeRequestId: string) {
  const response = await axios.post('/api/bridge-to-theta', {
    bridgeRequestId,
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
export async function bridgeToRinkeby(bridgeRequestId: string) {
  const response = await axios.post('/api/bridge-to-rinkeby', {
    bridgeRequestId,
  });
  return response.data.hash;
}
