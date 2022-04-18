import { Button, Stack } from '@mui/material';
import rinkebyTokens from 'config/rinkebyTokens.json';
import BridgeInput from './BridgeInput';
import BridgeInputReadonly from './BridgeInputReadonly';
import ConnectWrapper from './ConnectWrapper';

export default function BridgeDeposit() {
  return (
    <Stack component="form" spacing={2}>
      <BridgeInput network="Rinkeby" options={rinkebyTokens} />
      <BridgeInputReadonly network="Theta Testnet" />
      <ConnectWrapper>
        <Button variant="contained" size="large">
          Deposit
        </Button>
      </ConnectWrapper>
    </Stack>
  );
}
