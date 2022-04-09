import { useWeb3React } from '@web3-react/core';
import { ZERO_ADDRESS } from 'config/constants';
import { ethers } from 'ethers';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { getUniswapV2PairContract, useFactoryContract } from 'utils/ethers';

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
      enabled: Boolean(factoryContract) && Boolean(tokenA) && Boolean(tokenB),
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
    async () => await factoryContract!.allPairs(),
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

type AllPooledPairsResponse = {
  pair: string;
  balance: ethers.BigNumber;
  tokenA: string;
  tokenB: string;
  reserveA: ethers.BigNumber;
  reserveB: ethers.BigNumber;
}[];

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
          const reserveA = await pairContract.reserve0();
          const reserveB = await pairContract.reserve1();

          return {
            pair: pairAddress,
            balance,
            tokenA,
            tokenB,
            reserveA,
            reserveB,
          };
        })
      ),
    {
      enabled: Boolean(library) && Boolean(account) && Boolean(allPairs),
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
