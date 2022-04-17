import { Button } from '@mui/material';
import BridgeInput from './BridgeInput';
import ConnectWrapper from './ConnectWrapper';

export default function BridgeDeposit() {
  return (
    <>
      <BridgeInput network="Rinkeby" />
      <BridgeInput network="Theta Testnet" />
      <ConnectWrapper>
        <Button variant="contained" size="large">
          Deposit
        </Button>
      </ConnectWrapper>
    </>
  );
}
