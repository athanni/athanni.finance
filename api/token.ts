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
   * Convert the number to string without any formatting limiting the output to
   * 4 decimal places.
   */
  toPlainString(): string {
    return this.inMajorUnit().toFixed(4, 1);
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
export function useTokenBalance(token: string) {
  const { account } = useWeb3React();
  const erc20Contract = useERC20Contract(token);

  return useQuery(
    ['token-balance', Boolean(erc20Contract), token, account],
    async () => {
      const balance = await erc20Contract!.balanceOf(account!);
      return new TokenBalance(token, balance);
    },
    {
      // Refetch the token balance after every 10 seconds.
      refetchInterval: 10 * 1000,
      enabled: Boolean(erc20Contract && account),
    }
  );
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

      return await contract.approve(
        config.ROUTER_CONTRACT_ADDRESS,
        amount.toString()
      );
    },
    [account, library]
  );
}
