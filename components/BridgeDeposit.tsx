import { Button, Stack } from '@mui/material';
import rinkebyTokens from 'config/rinkebyTokens.json';
import { FormProvider, useForm } from 'react-hook-form';
import BridgeInput from './BridgeInput';
import BridgeInputReadonly from './BridgeInputReadonly';
import ConnectWrapper from './ConnectWrapper';

export default function BridgeDeposit() {
  const form = useForm({
    defaultValues: {
      address: '0x',
      amount: '',
    },
  });

  return (
    <FormProvider {...form}>
      <Stack component="form" spacing={2}>
        <BridgeInput network="Rinkeby" options={rinkebyTokens} />
        <BridgeInputReadonly network="Theta Testnet" />
        <ConnectWrapper>
          <Button variant="contained" size="large">
            Deposit
          </Button>
        </ConnectWrapper>
      </Stack>
    </FormProvider>
  );
}
