import { Button, ButtonGroup } from '@mui/material';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { THETA_TESTNET_CHAIN_ID } from 'config/constants';

export default function ChainSwitch() {
  const { chainId, error } = useWeb3React();
  const isUnsupported = error instanceof UnsupportedChainIdError;

  return (
    <ButtonGroup variant="contained" color="inherit">
      <Button
        color={chainId === THETA_TESTNET_CHAIN_ID ? 'secondary' : 'inherit'}
      >
        Theta Testnet
      </Button>
      {isUnsupported && <Button color="error">Unsupported</Button>}
    </ButtonGroup>
  );
}
