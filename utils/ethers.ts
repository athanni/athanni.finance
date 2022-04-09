import { useWeb3React } from '@web3-react/core';
import erc20Abi from 'abi/ERC20.json';
import factoryAbi from 'abi/UniswapV2Factory.json';
import uniswapV2PairAbi from 'abi/UniswapV2Pair.json';
import routerAbi from 'abi/UniswapV2Router02.json';
import config from 'config/config';
import { ContractTransaction, ethers } from 'ethers';
import { useMemo } from 'react';
import { useAsync } from 'react-use';

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
  ): Promise<ContractTransaction>;
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
      routerAbi,
      signer
    ) as RouterContract;
  }, [library]);
}

type FactoryContract = ethers.Contract & {
  getPair(tokenA: string, tokenB: string): Promise<string>;
  allPairs(index: number): Promise<string>;
  allPairsLength(): Promise<ethers.BigNumber>;
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
      factoryAbi,
      signer
    ) as FactoryContract;
  }, [factoryAddress, library]);
}

type ERC20Contract = ethers.Contract & {
  balanceOf(address: string): Promise<ethers.BigNumber>;
  decimals(): Promise<ethers.BigNumber>;
  allowance(ownner: string, spender: string): Promise<ethers.BigNumber>;
  approve(spender: string, amount: string): Promise<ContractTransaction>;
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
  return new ethers.Contract(address, erc20Abi, signer) as ERC20Contract;
}

/**
 * Gets the ERC20 contract API using ethers.
 */
export function useERC20Contract(address: string): ERC20Contract | null {
  const { library } = useWeb3React();
  return useMemo(() => getERC20Contract(library, address), [address, library]);
}

type UniswapV2PairContract = ERC20Contract & {
  token0(): Promise<string>;
  token1(): Promise<string>;
  getReserves(): Promise<
    [ethers.BigNumber, ethers.BigNumber, ethers.BigNumber]
  >;
};

/**
 * Gets the UniswapV2Pair contract API using ethers.
 */
export function getUniswapV2PairContract(
  library: any,
  address: string
): UniswapV2PairContract | null {
  if (!library) {
    return null;
  }

  const signer = library.getSigner();
  return new ethers.Contract(
    address,
    uniswapV2PairAbi,
    signer
  ) as UniswapV2PairContract;
}
