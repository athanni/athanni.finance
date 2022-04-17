import { useWeb3React } from '@web3-react/core';
import { ReactNode } from 'react';
import { useCorrectChainId } from 'utils/chain';
import ConnectWallet from './ConnectWallet';

type ConnectWrapperProps = {
  children?: ReactNode;
};

export default function ConnectWrapper({ children }: ConnectWrapperProps) {
  const { isActive, chainId } = useWeb3React();
  const correctChainId = useCorrectChainId();
  const isCorrectChain = chainId === correctChainId;

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
