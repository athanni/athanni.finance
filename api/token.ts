import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import config from 'config/config';
import supportedTokens from 'config/supportedTokens';
import { ethers } from 'ethers';
import { useCallback, useEffect } from 'react';
import { useQuery } from 'react-query';
import { getERC20Contract, useERC20Contract } from 'utils/ethers';

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

/**
 * Before a transaction, if an approval of a token to be transferred is needed,
 * then it is executed.
 */
export function useApprovalOfTransfer() {
  const { library, account } = useWeb3React();

  return useCallback(
    async (token: string, amount: ethers.BigNumber) => {
      if (!library || !account) {
        return;
      }

      const contract = getERC20Contract(library, token);
      if (!contract) {
        return;
      }

      const allowance = await contract.allowance(
        account,
        config.ROUTER_CONTRACT_ADDRESS
      );

      if (allowance.gte(amount)) {
        // No need of approval.
        return;
      }

      await contract.approve(config.ROUTER_CONTRACT_ADDRESS, amount.toString());
    },
    [account, library]
  );
}
