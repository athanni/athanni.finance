import { Button, Stack } from '@mui/material';
import { thetaTestnetTokens } from 'config/supportedTokens';
import { FormProvider, useForm } from 'react-hook-form';
import BridgeInput from './BridgeInput';
import BridgeInputReadonly from './BridgeInputReadonly';
import ConnectWrapper from './ConnectWrapper';

export default function BridgeWithdraw() {
  const form = useForm({
    defaultValues: {
      address: '0x',
      amount: '',
    },
  });

  return (
    <FormProvider {...form}>
      <Stack component="form" spacing={2}>
        <BridgeInput network="Theta Testnet" options={thetaTestnetTokens} />
        <BridgeInputReadonly network="Rinkeby" />
        <ConnectWrapper>
          <Button variant="contained" size="large">
            Withdraw
          </Button>
        </ConnectWrapper>
      </Stack>
    </FormProvider>
  );
}
