import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { ZERO_ADDRESS } from 'config/constants';
import { ethers } from 'ethers';
import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { getUniswapV2PairContract, useFactoryContract } from 'utils/ethers';
import { TokenBalance } from './token';

/**
 * Gets the pair address for a pair of token addresses (if it exists).
 */
export function usePairAddressForTokens(tokenA?: string, tokenB?: string) {
  const factoryContract = useFactoryContract();

  return useQuery(
    ['pair-address-token', Boolean(factoryContract), tokenA, tokenB],
    async () => {
      const pairAddress = await factoryContract!.getPair(tokenA!, tokenB!);
      return pairAddress !== ZERO_ADDRESS ? pairAddress : null;
    },
    {
      enabled: Boolean(factoryContract && tokenA && tokenB),
    }
  );
}

/**
 * Gets all the pairs that can be traded within Athanni.
 */
export function useAllPairs() {
  const factoryContract = useFactoryContract();

  return useQuery(
    ['all-pairs', Boolean(factoryContract)],
    async () => {
      const length = await factoryContract!.allPairsLength();
      return await Promise.all(
        Array(length.toNumber())
          .fill(0)
          .map((_, index) => factoryContract!.allPairs(index))
      );
    },
    { enabled: Boolean(factoryContract) }
  );
}

/**
 * The balance of a liquid pool tokens of a pair.
 */
class LiquidPoolTokenBalance {
  balance: ethers.BigNumber;

  constructor(balance: ethers.BigNumber) {
    this.balance = balance;
  }

  toString() {
    const bal = new BigNumber(this.balance.toString());
    const decimals = 18;

    return bal.div(new BigNumber(10).pow(decimals)).toFormat(4, 1, {
      groupSize: 3,
      groupSeparator: ',',
      decimalSeparator: '.',
      fractionGroupSize: 1,
    });
  }
}

export type PooledPairItem = {
  address: string;
  currentAccountBalance: LiquidPoolTokenBalance;
  tokenA: string;
  tokenB: string;
  reserveA: TokenBalance;
  reserveB: TokenBalance;
};

export type AllPooledPairsResponse = PooledPairItem[];

/**
 * Gets all the pairs that are pooled.
 */
export function useAllPooledPairs() {
  const { data: allPairs } = useAllPairs();
  const { account, provider } = useWeb3React();

  return useQuery<AllPooledPairsResponse>(
    ['all-pooled-pairs', Boolean(provider), allPairs, account],
    async () =>
      Promise.all(
        allPairs!.map(async (pairAddress) => {
          const pairContract = getUniswapV2PairContract(provider, pairAddress)!;
          const [balance, tokenA, tokenB, [reserveA, reserveB]] =
            await Promise.all([
              pairContract.balanceOf(account!),
              pairContract.token0(),
              pairContract.token1(),
              pairContract.getReserves(),
            ]);

          return {
            address: pairAddress,
            currentAccountBalance: new LiquidPoolTokenBalance(balance),
            tokenA,
            tokenB,
            reserveA: new TokenBalance(tokenA, reserveA),
            reserveB: new TokenBalance(tokenB, reserveB),
          };
        })
      ),
    {
      enabled: Boolean(provider && account && allPairs),
    }
  );
}

type PooledPairResponse = {
  address: string;
  currentAccountBalance: LiquidPoolTokenBalance;
  totalSupply: LiquidPoolTokenBalance;
  tokenA: string;
  tokenB: string;
  reserveA: TokenBalance;
  reserveB: TokenBalance;
};

/**
 * Get a pooled pair for a token pair.
 */
export function usePoolPair(tokenA?: string, tokenB?: string) {
  const { account, provider } = useWeb3React();
  const { data: pairAddress } = usePairAddressForTokens(tokenA, tokenB);
  console.log({ provider });

  return useQuery<PooledPairResponse>(
    ['pooled-pair', Boolean(provider), account, pairAddress],
    async () => {
      const pairContract = getUniswapV2PairContract(provider, pairAddress!)!;
      const [balance, token0, [reserveA, reserveB], totalSupply] =
        await Promise.all([
          pairContract.balanceOf(account!),
          pairContract.token0(),
          pairContract.getReserves(),
          pairContract.totalSupply(),
        ]);

      return {
        address: pairAddress!,
        currentAccountBalance: new LiquidPoolTokenBalance(balance),
        totalSupply: new LiquidPoolTokenBalance(totalSupply),
        tokenA: tokenA!,
        tokenB: tokenB!,
        reserveA: new TokenBalance(
          tokenA!,
          tokenA === token0 ? reserveA : reserveB
        ),
        reserveB: new TokenBalance(
          tokenB!,
          tokenB === token0 ? reserveA : reserveB
        ),
      };
    },
    {
      enabled: Boolean(provider && account && pairAddress),
    }
  );
}

/**
 * Gets all the swappable token addresses from all the pooled pairs.
 */
export function useSwappableTokens() {
  const { data, ...rest } = useAllPooledPairs();
  const tokens = useMemo(() => {
    const all = new Set<string>();

    if (data) {
      data.forEach((poolPair) => {
        all.add(poolPair.tokenA);
        all.add(poolPair.tokenB);
      });
    }

    return Array.from(all);
  }, [data]);

  return { data: tokens, ...rest };
}
