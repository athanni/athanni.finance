import { Button } from '@mui/material';
import BridgeInput from './BridgeInput';

export default function BridgeWithdraw() {
  return (
    <>
      <BridgeInput />
      <BridgeInput />
      <Button variant="contained" size="large">
        Withdraw
      </Button>
    </>
  );
}
