import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { ZERO_ADDRESS } from 'config/constants';
import { ethers } from 'ethers';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { getUniswapV2PairContract, useFactoryContract } from 'utils/ethers';
import { TokenBalance } from './token';

/**
 * Gets the pair address for a pair of token addresses (if it exists).
 */
export function usePairAddressForTokens(tokenA?: string, tokenB?: string) {
  const factoryContract = useFactoryContract();

  const query = useQuery(
    ['pair-address-token', tokenA, tokenB],
    async () => {
      const pairAddress = await factoryContract!.getPair(tokenA!, tokenB!);
      return pairAddress !== ZERO_ADDRESS ? pairAddress : null;
    },
    {
      enabled: Boolean(factoryContract && tokenA && tokenB),
    }
  );

  // Refetch if the tokens change.
  const { refetch } = query;
  useEffect(() => {
    if (factoryContract && tokenA && tokenB) {
      refetch();
    }
  }, [factoryContract, refetch, tokenA, tokenB]);

  return query;
}

/**
 * Gets all the pairs that can be traded within Athanni.
 */
export function useAllPairs() {
  const factoryContract = useFactoryContract();

  const query = useQuery(
    'all-pairs',
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

  const { refetch } = query;
  useEffect(() => {
    if (factoryContract) {
      refetch();
    }
  }, [factoryContract, refetch]);

  return query;
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

    return bal.div(new BigNumber(10).pow(decimals)).toFormat({
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
  const { account, library } = useWeb3React();

  const query = useQuery<AllPooledPairsResponse>(
    ['all-pooled-pairs', account],
    async () =>
      Promise.all(
        allPairs!.map(async (pairAddress) => {
          const pairContract = getUniswapV2PairContract(library, pairAddress)!;
          const balance = await pairContract.balanceOf(account!);
          const tokenA = await pairContract.token0();
          const tokenB = await pairContract.token1();
          const [reserveA, reserveB] = await pairContract.getReserves();

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
      enabled: Boolean(library && account && allPairs),
    }
  );

  const { refetch } = query;
  useEffect(() => {
    if (library && account && allPairs) {
      refetch();
    }
  }, [account, allPairs, library, refetch]);

  return query;
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
  const { account, library } = useWeb3React();
  const { data: pairAddress } = usePairAddressForTokens(tokenA, tokenB);

  const query = useQuery<PooledPairResponse>(
    ['pooled-pair', account, pairAddress],
    async () => {
      const pairContract = getUniswapV2PairContract(library, pairAddress!)!;
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
      enabled: Boolean(library && account && pairAddress),
    }
  );

  const { refetch } = query;
  useEffect(() => {
    if (library && account && pairAddress) {
      refetch();
    }
  }, [account, library, pairAddress, refetch]);

  return query;
}
