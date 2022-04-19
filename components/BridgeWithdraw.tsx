import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import { Stack } from '@mui/material';
import { bridgeToRinkeby, useBurnAmountInTheta } from 'api/bridge';
import { useApprovalOfTransfer } from 'api/token';
import BigNumber from 'bignumber.js';
import config from 'config/config';
import { thetaTestnetTokens } from 'config/supportedTokens';
import { ethers } from 'ethers';
import { useSnackbar } from 'notistack';
import { useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { rinkebyProvider } from 'utils/ethers';
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
    reset,
  } = form;

  const { enqueueSnackbar } = useSnackbar();
  const approvalOfTransfer = useApprovalOfTransfer();
  const burnAmountInTheta = useBurnAmountInTheta();
  const onSubmit = useCallback(
    async (state: any) => {
      const { address, amount } = state as SchemaType;
      const baseAmount = convertAmountToBaseUnit(amount.toFixed(), address);

      try {
        const approvalTx = await approvalOfTransfer(
          address,
          ethers.BigNumber.from(baseAmount),
          config.CHILD_PORTAL_ADDRESS
        );
        if (!approvalTx) {
          return;
        }
        await approvalTx.wait();

        const lockTx = await burnAmountInTheta(address, baseAmount);
        if (!lockTx) {
          return;
        }
        await lockTx.wait();
        const bridgeHash = await bridgeToRinkeby(lockTx.hash);
        await rinkebyProvider.waitForTransaction(bridgeHash);

        enqueueSnackbar('Successfully bridged your tokens.', {
          variant: 'error',
        });
        reset();
      } catch (err) {
        enqueueSnackbar('Failed to bridge tokens.', {
          variant: 'error',
        });

        throw err;
      }
    },
    [approvalOfTransfer, burnAmountInTheta, enqueueSnackbar, reset]
  );

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
