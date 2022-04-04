import { ZERO_ADDRESS } from 'config/constants';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useFactoryContract } from 'utils/ethers';

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
