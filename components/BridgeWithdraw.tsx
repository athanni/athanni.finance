import { Button, Stack } from '@mui/material';
import rinkebyTokens from 'config/rinkebyTokens.json';
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
        <BridgeInput network="Theta Testnet" options={rinkebyTokens} />
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
