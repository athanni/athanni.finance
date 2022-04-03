import { Button, Tooltip } from '@mui/material';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';

export default function ConnectedChain() {
  const { active, error } = useWeb3React();
  const isInvalidChain = error instanceof UnsupportedChainIdError;

  return (
    <>
      {active && <Button variant="text">Theta Testnet</Button>}

      {isInvalidChain && (
        <Tooltip title="Switch to Theta testnet on MetaMask.">
          <Button variant="text" color="error">
            Unknown Network
          </Button>
        </Tooltip>
      )}
    </>
  );
}
