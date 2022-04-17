import { Button } from '@mui/material';
import BridgeInput from './BridgeInput';

export default function BridgeDeposit() {
  return (
    <>
      <BridgeInput />
      <BridgeInput />
      <Button variant="contained" size="large">
        Deposit
      </Button>
    </>
  );
}
