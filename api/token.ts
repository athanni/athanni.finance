import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import supportedTokens from 'config/supportedTokens';
import { ethers } from 'ethers';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useERC20Contract } from 'utils/ethers';

class TokenBalance {
  address: string;
  balance: ethers.BigNumber;

  constructor(address: string, balance: ethers.BigNumber) {
    this.address = address;
    this.balance = balance;
  }

  toString() {
    const bal = new BigNumber(this.balance.toString());
    const token = supportedTokens.find((it) => it.address === this.address);
    if (!token) {
      throw new Error('unsupported token used');
    }

    return bal.div(new BigNumber(10).pow(token.decimals)).toFormat({
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
      const balance = await erc20Contract!.balanceOf(account!);
      return new TokenBalance(token, balance);
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
