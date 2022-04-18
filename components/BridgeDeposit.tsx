import { Button } from '@mui/material';
import rinkebyTokens from 'config/rinkebyTokens.json';
import BridgeInput from './BridgeInput';
import BridgeInputReadonly from './BridgeInputReadonly';
import ConnectWrapper from './ConnectWrapper';

export default function BridgeDeposit() {
  return (
    <>
      <BridgeInput network="Rinkeby" options={rinkebyTokens} />
      <BridgeInputReadonly network="Theta Testnet" />
      <ConnectWrapper>
        <Button variant="contained" size="large">
          Deposit
        </Button>
      </ConnectWrapper>
    </>
  );
}
