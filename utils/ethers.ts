import { useWeb3React } from '@web3-react/core';
import config from 'config/config';
import { ethers } from 'ethers';
import { useMemo } from 'react';
import { useAsync } from 'react-use';
import factoryContractAbi from './factoryContractAbi';
import pairContractAbi from './pairContractAbi';
import routerContractAbi from './routerContractAbi';

type RouterContract = ethers.Contract & {
  factory(): Promise<string>;
  addLiquidity(
    tokenA: string,
    tokenB: string,
    amountADesired: ethers.BigNumber,
    amountBDesired: ethers.BigNumber,
    amountAMin: ethers.BigNumber,
    amountBMin: ethers.BigNumber,
    to: string,
    deadline: ethers.BigNumber
  ): Promise<[ethers.BigNumber, ethers.BigNumber, ethers.BigNumber]>;
};

/**
 * Gets the router contract API using ethers.
 */
export function useRouterContract(): RouterContract | null {
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
    ) as RouterContract;
  }, [library]);
}

/**
 * Gets the factory contract API using ethers.
 */
export function useFactoryContract(): ethers.Contract | null {
  const { library } = useWeb3React();
  const routerContract = useRouterContract();

  // The factory address is provided by the router itself. No need
  // to hardcode that.
  const { value: factoryAddress } = useAsync(async () => {
    if (!routerContract) {
      return null;
    }

    return await routerContract.factory();
  }, [routerContract]);

  return useMemo(() => {
    if (!library || !factoryAddress) {
      return null;
    }

    const signer = library.getSigner();
    return new ethers.Contract(factoryAddress, factoryContractAbi, signer);
  }, [factoryAddress, library]);
}

/**
 * Gets the pair contract API using ethers.
 */
export function usePairContract(pairAddress: string): ethers.Contract | null {
  const { library } = useWeb3React();
  return useMemo(() => {
    if (!library) {
      return null;
    }

    const signer = library.getSigner();
    return new ethers.Contract(pairAddress, pairContractAbi, signer);
  }, [pairAddress, library]);
}
