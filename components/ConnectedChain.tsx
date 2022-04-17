import { Button } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import config from 'config/config';

export default function ConnectedChain() {
  const { chainId } = useWeb3React();

  return (
    <Button variant="contained" color="inherit">
      {chainId === config.CHAIN_ID ? 'Theta Testnet' : 'Rinkeby'}
    </Button>
  );
}
