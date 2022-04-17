import { Button } from '@mui/material';
import BridgeInput from './BridgeInput';
import ConnectWrapper from './ConnectWrapper';

export default function BridgeWithdraw() {
  return (
    <>
      <BridgeInput network="Theta Testnet" />
      <BridgeInput network="Rinkeby" />
      <ConnectWrapper>
        <Button variant="contained" size="large">
          Withdraw
        </Button>
      </ConnectWrapper>
    </>
  );
}
