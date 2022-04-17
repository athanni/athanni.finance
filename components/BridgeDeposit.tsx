import { Button } from '@mui/material';
import BridgeInput from './BridgeInput';

export default function BridgeDeposit() {
  return (
    <>
      <BridgeInput network="Rinkeby" />
      <BridgeInput network="Theta Testnet" />
      <Button variant="contained" size="large">
        Deposit
      </Button>
    </>
  );
}
