import { useWeb3React } from '@web3-react/core';
import config from 'config/config';
import { ethers } from 'ethers';
import { useMemo } from 'react';
import routerContractAbi from './routerContractAbi';

/**
 * Gets the router contract API using ethers.
 */
export function useRouterContract(): ethers.Contract | null {
  const { library } = useWeb3React();
  return useMemo(() => {
    if (!library) {
      return null;
    }

    const signer = library.getSigner();
    return new ethers.Contract(
      config.ROUTER_CONTRACT_ADDRESS,
      routerContractAbi,
      signer
    );
  }, [library]);
}
