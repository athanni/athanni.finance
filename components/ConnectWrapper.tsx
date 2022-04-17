import { useWeb3React } from '@web3-react/core';
import config from 'config/config';
import { ReactNode } from 'react';
import ConnectWallet from './ConnectWallet';

type ConnectWrapperProps = {
  children?: ReactNode;
};

export default function ConnectWrapper({ children }: ConnectWrapperProps) {
  const { isActive, chainId } = useWeb3React();
  const isCorrectChain = chainId === config.CHAIN_ID;

  return (
    <>
      {isActive && isCorrectChain ? (
        children
      ) : (
        <ConnectWallet
          buttonProps={{
            size: 'large',
            fullWidth: true,
          }}
        />
      )}
    </>
  );
}
