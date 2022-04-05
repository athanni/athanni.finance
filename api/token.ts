import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useERC20Contract } from 'utils/ethers';

class TokenBalance {
  balance: ethers.BigNumber;
  decimals: ethers.BigNumber;

  constructor(balance: ethers.BigNumber, decimals: ethers.BigNumber) {
    this.balance = balance;
    this.decimals = decimals;
  }

  toString() {
    const bal = new BigNumber(this.balance.toString());
    const dec = new BigNumber(this.decimals.toString());
    return bal.div(new BigNumber(10).pow(dec)).toFormat({
      groupSize: 3,
      groupSeparator: ',',
      decimalSeparator: '.',
      fractionGroupSize: 1,
    });
  }
}

/**
 * Fetches the token balance of the user.
 */
export function useTokenBalance(token: string) {
  const { account } = useWeb3React();
  const erc20Contract = useERC20Contract(token);

  const query = useQuery(
    ['token-balance', token, account],
    async () => {
      const [balance, decimals] = await Promise.all([
        erc20Contract!.balanceOf(account!),
        erc20Contract!.decimals(),
      ]);
      return new TokenBalance(balance, decimals);
    },
    {
      enabled: Boolean(erc20Contract) && Boolean(account),
    }
  );

  const { refetch } = query;
  useEffect(() => {
    if (account && erc20Contract) {
      refetch();
    }
  }, [account, erc20Contract, refetch]);

  return query;
}
