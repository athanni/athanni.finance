import { useWeb3React } from '@web3-react/core';
import { THETA_DEFAULT_DEADLINE_FROM_NOW } from 'config/constants';
import { ethers } from 'ethers';
import { useCallback } from 'react';
import { useRouterContract } from 'utils/ethers';

type AddLiquidityArgs = {
  tokenA: string;
  tokenB: string;
  amountADesired: ethers.BigNumber;
  amountBDesired: ethers.BigNumber;
  amountAMin: ethers.BigNumber;
  amountBMin: ethers.BigNumber;
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

      const deadline = ethers.BigNumber.from(
        THETA_DEFAULT_DEADLINE_FROM_NOW
      ).add(ethers.BigNumber.from(Date.now()).div(1000));

      await routerContract.addLiquidity(
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
