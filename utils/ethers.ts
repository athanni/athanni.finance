import { useWeb3React } from '@web3-react/core';
import childPortalAbi from 'abi/ChildPortal.json';
import erc20Abi from 'abi/ERC20.json';
import rootPortalAbi from 'abi/RootPortal.json';
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
  removeLiquidity(
    tokenA: string,
    tokenB: string,
    liquidity: string,
    amountAMin: string,
    amountBMin: string,
    to: string,
    deadline: string
  ): Promise<ContractTransaction>;
  getAmountsOut(amountIn: string, path: string[]): Promise<ethers.BigNumber[]>;
  getAmountsIn(amountIn: string, path: string[]): Promise<ethers.BigNumber[]>;
  swapExactTokensForTokens(
    amountIn: string,
    amountOutMin: string,
    path: string[],
    to: string,
    deadline: string
  ): Promise<ContractTransaction>;
  swapTokensForExactTokens(
    amountOut: string,
    amountInMax: string,
    path: string[],
    to: string,
    deadline: string
  ): Promise<ContractTransaction>;
};

/**
 * Gets the router contract API using ethers.
 */
export function useRouterContract(): RouterContract | null {
  const { provider } = useWeb3React();
  return useMemo(() => {
    if (!provider) {
      return null;
    }

    const signer = (provider as any).getSigner();
    return new ethers.Contract(
      config.ROUTER_CONTRACT_ADDRESS,
      routerAbi,
      signer
    ) as RouterContract;
  }, [provider]);
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
  const { provider } = useWeb3React();
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
    if (!provider || !factoryAddress) {
      return null;
    }

    const signer = (provider as any).getSigner();
    return new ethers.Contract(
      factoryAddress,
      factoryAbi,
      signer
    ) as FactoryContract;
  }, [factoryAddress, provider]);
}

type ERC20Contract = ethers.Contract & {
  balanceOf(address: string): Promise<ethers.BigNumber>;
  totalSupply(): Promise<ethers.BigNumber>;
  decimals(): Promise<ethers.BigNumber>;
  allowance(ownner: string, spender: string): Promise<ethers.BigNumber>;
  approve(spender: string, amount: string): Promise<ContractTransaction>;
};

/**
 * Gets the ERC20 contract API using ethers.
 */
export function getERC20Contract(
  provider: any,
  address: string
): ERC20Contract | null {
  if (!provider) {
    return null;
  }

  const signer = provider.getSigner();
  return new ethers.Contract(address, erc20Abi, signer) as ERC20Contract;
}

/**
 * Gets the ERC20 contract API using ethers.
 */
export function useERC20Contract(address?: string): ERC20Contract | null {
  const { provider } = useWeb3React();

  return useMemo(
    () => (address ? getERC20Contract(provider, address) : null),
    [address, provider]
  );
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
  provider: any,
  address: string
): UniswapV2PairContract | null {
  if (!provider) {
    return null;
  }

  const signer = provider.getSigner();
  return new ethers.Contract(
    address,
    uniswapV2PairAbi,
    signer
  ) as UniswapV2PairContract;
}

export type PortalContract = ethers.Contract & {
  tokenAddress(bridgeId: string): Promise<string>;
  transferredBy(bridgeId: string): Promise<string>;
  transferredTo(bridgeId: string): Promise<string>;
  transferredAmount(bridgeId: string): Promise<ethers.BigNumber>;
};

export type RootPortalContract = PortalContract & {
  send(token: string, to: string, amount: string): Promise<ContractTransaction>;
};

/**
 * Gets the RootPortal contract API using ethers.
 */
export function useRootPortalContract(): RootPortalContract | null {
  const { provider } = useWeb3React();

  return useMemo(() => {
    if (!provider) {
      return null;
    }

    const signer = (provider as any).getSigner();
    return new ethers.Contract(
      config.ROOT_PORTAL_ADDRESS,
      rootPortalAbi,
      signer
    ) as RootPortalContract;
  }, [provider]);
}

export type ChildPortalContract = PortalContract & {
  withdraw(
    token: string,
    to: string,
    amount: string
  ): Promise<ContractTransaction>;
};

/**
 * Gets the ChildPortal contract API using ethers.
 */
export function useChildPortalContract(): ChildPortalContract | null {
  const { provider } = useWeb3React();

  return useMemo(() => {
    if (!provider) {
      return null;
    }

    const signer = (provider as any).getSigner();
    return new ethers.Contract(
      config.CHILD_PORTAL_ADDRESS,
      childPortalAbi,
      signer
    ) as ChildPortalContract;
  }, [provider]);
}
