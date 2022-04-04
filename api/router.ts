import { THETA_DEFAULT_DEADLINE_FROM_NOW } from 'config/constants';
import { ethers } from 'ethers';
import { useAsyncFn } from 'react-use';
import { useRouterContract } from 'utils/ethers';

type AddLiquidityArgs = {
  tokenA: string;
  tokenB: string;
  amountADesired: ethers.BigNumber;
  amountBDesired: ethers.BigNumber;
  amountAMin: ethers.BigNumber;
  amountBMin: ethers.BigNumber;
  to: string;
};

/**
 * Adds liquidity for a token pair.
 */
export function useAddLiquidity() {
  const routerContract = useRouterContract();

  return useAsyncFn(
    async (args: AddLiquidityArgs) => {
      if (!routerContract) {
        return;
      }

      await routerContract.addLiquidity(
        args.tokenA,
        args.tokenB,
        args.amountADesired,
        args.amountBDesired,
        args.amountAMin,
        args.amountBMin,
        args.to,
        ethers.BigNumber.from(THETA_DEFAULT_DEADLINE_FROM_NOW)
      );
    },
    [routerContract]
  );
}
