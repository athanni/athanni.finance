import { useWeb3React } from '@web3-react/core';
import { THETA_DEFAULT_DEADLINE_FROM_NOW } from 'config/constants';
import { ethers } from 'ethers';
import { useCallback } from 'react';
import { useQuery } from 'react-query';
import { useRouterContract } from 'utils/ethers';

type AddLiquidityArgs = {
  tokenA: string;
  tokenB: string;
  amountADesired: string;
  amountBDesired: string;
  amountAMin: string;
  amountBMin: string;
};

/**
 * Adds liquidity for a token pair.
 */
export function useAddLiquidity() {
  const routerContract = useRouterContract();
  const { account } = useWeb3React();

  return useCallback(
    async (args: AddLiquidityArgs) => {
      if (!routerContract || !account) {
        return;
      }

      const deadline = ethers.BigNumber.from(THETA_DEFAULT_DEADLINE_FROM_NOW)
        .add(ethers.BigNumber.from(Date.now()).div(1000))
        .toString();

      return await routerContract.addLiquidity(
        args.tokenA,
        args.tokenB,
        args.amountADesired,
        args.amountBDesired,
        args.amountAMin,
        args.amountBMin,
        account,
        deadline
      );
    },
    [account, routerContract]
  );
}

type RemoveLiquidityArgs = {
  tokenA: string;
  tokenB: string;
  liquidity: string;
  amountAMin: string;
  amountBMin: string;
};

/**
 * Removes liquidity for a token pair.
 */
export function useRemoveLiquidity() {
  const routerContract = useRouterContract();
  const { account } = useWeb3React();

  return useCallback(
    async (args: RemoveLiquidityArgs) => {
      if (!routerContract || !account) {
        return;
      }

      const deadline = ethers.BigNumber.from(THETA_DEFAULT_DEADLINE_FROM_NOW)
        .add(ethers.BigNumber.from(Date.now()).div(1000))
        .toString();

      return await routerContract.removeLiquidity(
        args.tokenA,
        args.tokenB,
        args.liquidity,
        args.amountAMin,
        args.amountBMin,
        account,
        deadline
      );
    },
    [account, routerContract]
  );
}

/**
 * Gets the output amount for the input amount after swapping through the tokens
 * in the given path.
 */
export function useAmountsOut(amountIn: string, path: string[]) {
  const routerContract = useRouterContract();

  return useQuery(
    ['amounts-out', Boolean(routerContract), amountIn, ...path],
    async () => routerContract!.getAmountsOut(amountIn, path),
    {
      // Every 10ms fetch a new value.
      refetchInterval: 10 * 1000,
      enabled: Boolean(routerContract && path.length > 0),
    }
  );
}

/**
 * Gets the input amount for the output amount that is to be swapped through the tokens
 * in the given path.
 */
export function useAmountsIn(amountOut: string, path: string[]) {
  const routerContract = useRouterContract();

  return useQuery(
    ['amounts-out', Boolean(routerContract), amountOut, ...path],
    async () => routerContract!.getAmountsIn(amountOut, path),
    {
      // Every 10ms fetch a new value.
      refetchInterval: 10 * 1000,
      enabled: Boolean(routerContract && path.length > 0),
    }
  );
}
