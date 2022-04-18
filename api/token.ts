import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import config from 'config/config';
import supportedTokens, { tokenMap } from 'config/supportedTokens';
import { ethers } from 'ethers';
import { useCallback } from 'react';
import { useQuery } from 'react-query';
import { getERC20Contract, useERC20Contract } from 'utils/ethers';

export class TokenBalance {
  address: string;
  balance: ethers.BigNumber;

  constructor(address: string, balance: ethers.BigNumber) {
    this.address = address;
    this.balance = balance;
  }

  /**
   * Converts the token balance from its base unit to the major unit.
   */
  inMajorUnit(): BigNumber {
    const bal = new BigNumber(this.balance.toString());
    const token = supportedTokens.find((it) => it.address === this.address);
    if (!token) {
      throw new Error('unsupported token used');
    }

    return bal.div(new BigNumber(10).pow(token.decimals));
  }

  /**
   * A ratio between two tokens.
   */
  tokenRatioWith(another: TokenBalance): BigNumber {
    return this.inMajorUnit().div(another.inMajorUnit());
  }

  /**
   * A ratio between two tokens as formatted string.
   */
  tokenRatioWithAsString(another: TokenBalance): string {
    const ratio = this.tokenRatioWith(another);
    return ratio.toFormat({
      groupSize: 3,
      groupSeparator: ',',
      decimalSeparator: '.',
      fractionGroupSize: 1,
    });
  }

  /**
   * Divide the balance by a number.
   */
  dividedBy(num: BigNumber): TokenBalance {
    return new TokenBalance(
      this.address,
      ethers.BigNumber.from(
        new BigNumber(this.balance.toString())
          .dividedBy(num)
          .integerValue()
          .toFixed()
      )
    );
  }

  /**
   * Checks if the token balance is less than the given [number]. The number
   * is in a major unit.
   */
  lt(major: BigNumber): boolean {
    return new BigNumber(this.balance.toString()).lt(
      major.multipliedBy(new BigNumber(10).pow(tokenMap[this.address].decimals))
    );
  }

  /**
   * Format the token amount for user viewing.
   */
  toString(): string {
    return this.inMajorUnit().toFormat(4, 1, {
      groupSize: 3,
      groupSeparator: ',',
      decimalSeparator: '.',
      fractionGroupSize: 1,
    });
  }

  /**
   * Convert the balance to string in major units without any formatting to
   * unlimited decimal places.
   */
  toPlainString(): string {
    return this.inMajorUnit().toFixed();
  }

  /**
   * Gets the ticker of the token.
   */
  toTicker(): string {
    return tokenMap[this.address].ticker;
  }
}

/**
 * Fetches the token balance of the user.
 */
export function useTokenBalance(token?: string) {
  const { account } = useWeb3React();
  const erc20Contract = useERC20Contract(token);

  return useQuery(
    ['token-balance', Boolean(erc20Contract), token, account],
    async () => {
      const balance = await erc20Contract!.balanceOf(account!);
      return new TokenBalance(token!, balance);
    },
    {
      // Refetch the token balance after every 10 seconds.
      refetchInterval: 10 * 1000,
      enabled: Boolean(erc20Contract && token && account),
    }
  );
}

/**
 * Before a transaction, if an approval of a token to be transferred is needed,
 * then it is executed.
 */
export function useApprovalOfTransfer() {
  const { provider, account } = useWeb3React();

  return useCallback(
    async (
      token: string,
      amount: ethers.BigNumber,
      spender: string = config.ROUTER_CONTRACT_ADDRESS
    ) => {
      if (!provider || !account) {
        return;
      }

      const contract = getERC20Contract(provider, token);
      if (!contract) {
        return;
      }

      const allowance = await contract.allowance(account, spender);

      if (allowance.gte(amount)) {
        // No need of approval.
        return;
      }

      return await contract.approve(spender, amount.toString());
    },
    [account, provider]
  );
}
