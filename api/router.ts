import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { THETA_DEFAULT_DEADLINE_FROM_NOW } from 'config/constants';
import { ethers } from 'ethers';
import { useCallback, useMemo } from 'react';
import { useQuery } from 'react-query';
import { useRouterContract } from 'utils/ethers';
import { useAllPooledPairs, usePoolPair } from './pairs';
import { TokenBalance } from './token';

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
 * A map that can easily be used to get the pair address for any two addresses.
 */
type PairMap = {
  [address: string]: {
    [address: string]: string;
  };
};

/**
 * Gets the swappable amounts for a given token [amount] either [source] or [destination]. The calculation
 * is done in the [direction]. If it is `in`, gets output amount for a given input amount of [source].
 * If it is `out`, gets the input amount for the given output amount of [destination].
 */
export function useSwapAmounts(
  source?: string,
  destination?: string,
  amount?: string,
  direction?: 'in' | 'out'
) {
  const { data: pooledPairs } = useAllPooledPairs();
  const pairMap = useMemo(
    () =>
      (pooledPairs ?? []).reduce((acc, cur) => {
        acc[cur.tokenA] ??= {};
        acc[cur.tokenB] ??= {};
        acc[cur.tokenA][cur.tokenB] = cur.address;
        acc[cur.tokenB][cur.tokenA] = cur.address;
        return acc;
      }, {} as PairMap),
    [pooledPairs]
  );

  const paths = useMemo(
    () =>
      source && destination
        ? findPaths(pairMap, source, destination, [source], 0)
        : [],
    [destination, pairMap, source]
  );

  const routerContract = useRouterContract();
  return useQuery(
    [
      'swap-amounts',
      Boolean(routerContract),
      source,
      destination,
      amount,
      direction,
    ],
    async () => {
      const getAmounts =
        direction === 'in'
          ? routerContract!.getAmountsIn
          : routerContract!.getAmountsOut;

      const amounts = await Promise.all(
        paths.map((path) => getAmounts(amount!, path))
      );

      return amounts.map((amount, i) => {
        const path = paths[i];
        return amount.map((amt, j) => new TokenBalance(path[j], amt));
      });
    },
    {
      // Every 10ms fetch a new value.
      refetchInterval: 10 * 1000,
      enabled: Boolean(
        routerContract &&
          source &&
          destination &&
          amount &&
          direction &&
          paths.length > 0
      ),
    }
  );
}

/**
 * Get all the valid paths that a source token can be converted to a destination token.
 */
function findPaths(
  map: PairMap,
  source: string,
  destination: string,
  currentPath: string[],
  recursionCount: number
): string[][] {
  recursionCount += 1;
  const foundPaths: string[][] = [];

  // A path cannot be very long because it is going to have higher costs for
  // swapping.
  if (recursionCount > 3) {
    return foundPaths;
  }

  Object.keys(map[source] ?? []).forEach((next) => {
    // If the destination matches, then a path was found.
    if (next === destination) {
      foundPaths.push([...currentPath, destination]);
      return;
    }

    // Try looking for other new paths which have not been traversed yet.
    if (!currentPath.includes(next)) {
      const paths = findPaths(
        map,
        next,
        destination,
        [...currentPath, next],
        recursionCount
      );
      foundPaths.push(...paths);
    }
  });

  return foundPaths;
}

/**
 * Gets the best swap amount for a
 */
export function useBestSwapAmount(
  source?: string,
  destination?: string,
  amount?: string,
  direction?: 'in' | 'out'
) {
  const { data, ...rest } = useSwapAmounts(
    source,
    destination,
    amount,
    direction
  );

  const best = useMemo(() => {
    const sorted = (data ?? []).sort((left, right) =>
      left[left.length - 1].balance
        .sub(right[right.length - 1].balance)
        .mod(2)
        .toNumber()
    );

    return sorted[sorted.length - 1] || null;
  }, [data]);

  return { data: best, ...rest };
}

/**
 * Gets the value of price impact for the token swap path.
 */
export function usePriceImpact(path: TokenBalance[]) {
  const first = path[0];
  const last = path[path.length - 1];
  const { data: poolPair } = usePoolPair(first.address, last.address);

  return useMemo(() => {
    if (!poolPair) {
      return null;
    }

    const marketPrice = new BigNumber(
      poolPair.reserveB.balance.toString()
    ).dividedBy(new BigNumber(poolPair.reserveA.balance.toString()));
    const currentPrice = new BigNumber(last.balance.toString()).dividedBy(
      new BigNumber(first.balance.toString())
    );
    const difference = currentPrice.minus(marketPrice);
    const percentage = difference
      .dividedBy(marketPrice)
      .multipliedBy(100)
      .toFixed(2);
    return `${percentage}%`;
  }, [first.balance, last.balance, poolPair]);
}
