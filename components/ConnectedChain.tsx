import { Button } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { THETA_TESTNET_CHAIN_ID } from 'config/constants';

export default function ConnectedChain() {
  const { chainId } = useWeb3React();

  return (
    <Button variant="contained" color="inherit">
      {chainId === THETA_TESTNET_CHAIN_ID ? 'Theta Testnet' : 'Rinkeby'}
    </Button>
  );
}
