import { Button } from '@mui/material';
import rinkebyTokens from 'config/rinkebyTokens.json';
import BridgeInput from './BridgeInput';
import ConnectWrapper from './ConnectWrapper';

export default function BridgeDeposit() {
  return (
    <>
      <BridgeInput network="Rinkeby" options={rinkebyTokens} />
      <BridgeInput network="Theta Testnet" options={rinkebyTokens} />
      <ConnectWrapper>
        <Button variant="contained" size="large">
          Deposit
        </Button>
      </ConnectWrapper>
    </>
  );
}
