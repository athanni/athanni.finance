import { useWeb3React } from '@web3-react/core';
import config from 'config/config';
import { ethers } from 'ethers';
import { useMemo } from 'react';
import { useAsync } from 'react-use';
import erc20ContractAbi from './erc20ContractAbi';
import factoryContractAbi from './factoryContractAbi';
import pairContractAbi from './pairContractAbi';
import routerContractAbi from './routerContractAbi';

type RouterContract = ethers.Contract & {
  factory(): Promise<string>;
  addLiquidity(
    tokenA: string,
    tokenB: string,
    amountADesired: string,
    amountBDesired: string,
    amountAMin: string,
    amountBMin: string,
    to: string,
    deadline: string
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

type FactoryContract = ethers.Contract & {
  getPair(tokenA: string, tokenB: string): Promise<string>;
};

/**
 * Gets the factory contract API using ethers.
 */
export function useFactoryContract(): FactoryContract | null {
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
    return new ethers.Contract(
      factoryAddress,
      factoryContractAbi,
      signer
    ) as FactoryContract;
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

type ERC20Contract = ethers.Contract & {
  balanceOf(address: string): Promise<ethers.BigNumber>;
  decimals(): Promise<ethers.BigNumber>;
  allowance(ownner: string, spender: string): Promise<ethers.BigNumber>;
  approve(spender: string, amount: string): Promise<boolean>;
};

/**
 * Gets the ERC20 contract API using ethers.
 */
export function getERC20Contract(
  library: any,
  address: string
): ERC20Contract | null {
  if (!library) {
    return null;
  }

  const signer = library.getSigner();
  return new ethers.Contract(
    address,
    erc20ContractAbi,
    signer
  ) as ERC20Contract;
}

/**
 * Gets the ERC20 contract API using ethers.
 */
export function useERC20Contract(address: string): ERC20Contract | null {
  const { library } = useWeb3React();
  return useMemo(() => getERC20Contract(library, address), [address, library]);
}
