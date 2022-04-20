import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import { Stack } from '@mui/material';
import { bridgeToTheta, useLockAmountToRinkeby } from 'api/bridge';
import { useApprovalOfTransfer } from 'api/token';
import BigNumber from 'bignumber.js';
import config from 'config/config';
import { rinkebyTokens } from 'config/supportedTokens';
import { ethers } from 'ethers';
import { useSnackbar } from 'notistack';
import { useCallback, useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { thetaTestnetProvider } from 'utils/ethers';
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
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = form;

  const [txStatus, setTxStatus] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const approvalOfTransfer = useApprovalOfTransfer();
  const lockAmountToRinkeby = useLockAmountToRinkeby();
  const onSubmit = useCallback(
    async (state: any) => {
      const { address, amount } = state as SchemaType;
      const baseAmount = convertAmountToBaseUnit(amount.toFixed(), address);

      try {
        setTxStatus('Approving Token Transfer');

        const approvalTx = await approvalOfTransfer(
          address,
          ethers.BigNumber.from(baseAmount),
          config.ROOT_PORTAL_ADDRESS
        );
        if (!approvalTx) {
          return;
        }
        await approvalTx.wait();

        setTxStatus('Bridging Your Tokens');
        const lockTx = await lockAmountToRinkeby(address, baseAmount);
        if (!lockTx) {
          return;
        }
        await lockTx.wait();
        const bridgeHash = await bridgeToTheta(lockTx.hash);

        setTxStatus('Verifying Transfer');
        await thetaTestnetProvider.waitForTransaction(bridgeHash);

        enqueueSnackbar('Successfully bridged your tokens.', {
          variant: 'success',
        });
        reset();
      } catch (err) {
        enqueueSnackbar('Failed to bridge tokens.', {
          variant: 'error',
        });

        throw err;
      } finally {
        setTxStatus(null);
      }
    },
    [approvalOfTransfer, enqueueSnackbar, lockAmountToRinkeby, reset]
  );

  const address = useWatch({ control, name: 'address' });
  const amount = useWatch({ control, name: 'amount' });
  const tokenSelect = address === '0x' && 'Select Token';
  const inputAmount = !amount && 'Input Amount';

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
            {txStatus || tokenSelect || inputAmount || 'Deposit'}
          </LoadingButton>
        </ConnectWrapper>
      </Stack>
    </FormProvider>
  );
}
