import { Button } from '@mui/material';
import BridgeInput from './BridgeInput';

export default function BridgeWithdraw() {
  return (
    <>
      <BridgeInput network="Theta Testnet" />
      <BridgeInput network="Rinkeby" />
      <Button variant="contained" size="large">
        Withdraw
      </Button>
    </>
  );
}
