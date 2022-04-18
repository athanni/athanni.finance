import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import { Stack } from '@mui/material';
import BigNumber from 'bignumber.js';
import { thetaTestnetTokens } from 'config/supportedTokens';
import { ethers } from 'ethers';
import { useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import BridgeInput from './BridgeInput';
import BridgeInputReadonly from './BridgeInputReadonly';
import ConnectWrapper from './ConnectWrapper';

const schema = z.object({
  address: z
    .string()
    .refine((v) => ethers.utils.isAddress(v), 'Not a valid address'),
  amount: z
    .string()
    .transform((v) => new BigNumber(v))
    .refine((v) => v.gt(0), 'Required'),
});

type SchemaType = z.infer<typeof schema>;

export default function BridgeWithdraw() {
  const form = useForm({
    defaultValues: {
      address: '0x',
      amount: '',
    },
    resolver: zodResolver(schema),
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = useCallback((state: any) => {
    const { address, amount } = state as SchemaType;
    console.log({ address, amount });
  }, []);

  return (
    <FormProvider {...form}>
      <Stack component="form" spacing={2} onSubmit={handleSubmit(onSubmit)}>
        <BridgeInput network="Theta Testnet" options={thetaTestnetTokens} />
        <BridgeInputReadonly network="Rinkeby" />
        <ConnectWrapper>
          <LoadingButton
            type="submit"
            variant="contained"
            size="large"
            loading={isSubmitting}
            loadingPosition="start"
            // Just to shut the error.
            startIcon={<></>}
          >
            Deposit
          </LoadingButton>
        </ConnectWrapper>
      </Stack>
    </FormProvider>
  );
}
