import { useQuery } from 'react-query';
import { useFactoryContract } from 'utils/ethers';

/**
 * Gets the pair address for a pair of token addresses (if it exists).
 */
export function usePairAddressForTokens(tokenA?: string, tokenB?: string) {
  const factoryContract = useFactoryContract();

  return useQuery(
    `pair-address-token-${tokenA}-${tokenB}`,
    async () => factoryContract!.getPair(tokenA!, tokenB!),
    {
      enabled: Boolean(factoryContract) && Boolean(tokenA) && Boolean(tokenB),
    }
  );
}
