import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import { Button, Stack } from '@mui/material';
import { useApprovalOfTransfer } from 'api/token';
import BigNumber from 'bignumber.js';
import config from 'config/config';
import { rinkebyTokens, tokenMap } from 'config/supportedTokens';
import { ethers } from 'ethers';
import { useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { convertAmountToBaseUnit } from 'utils/numeric';
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

export default function BridgeDeposit() {
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

  const approvalOfTransfer = useApprovalOfTransfer();
  const onSubmit = useCallback(
    async (state: any) => {
      const { address, amount } = state as SchemaType;
      const baseAmount = convertAmountToBaseUnit(amount.toFixed(), address);

      const approvalTx = await approvalOfTransfer(
        address,
        ethers.BigNumber.from(baseAmount),
        config.ROOT_PORTAL_ADDRESS
      );
      await approvalTx?.wait();

      if (!approvalTx) {
        return;
      }
    },
    [approvalOfTransfer]
  );

  return (
    <FormProvider {...form}>
      <Stack component="form" spacing={2} onSubmit={handleSubmit(onSubmit)}>
        <BridgeInput network="Rinkeby" options={rinkebyTokens} />
        <BridgeInputReadonly network="Theta Testnet" />
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
