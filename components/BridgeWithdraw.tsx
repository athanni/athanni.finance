import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import { Stack } from '@mui/material';
import { bridgeToRinkeby, useBurnAmountInTheta } from 'api/bridge';
import { useApprovalOfTransfer, useTokenBalance } from 'api/token';
import BigNumber from 'bignumber.js';
import config from 'config/config';
import { thetaTestnetTokens } from 'config/supportedTokens';
import { ethers } from 'ethers';
import { useSnackbar } from 'notistack';
import { useCallback, useMemo, useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useQueryClient } from 'react-query';
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
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = form;

  const queryClient = useQueryClient();
  const [txStatus, setTxStatus] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const approvalOfTransfer = useApprovalOfTransfer();
  const burnAmountInTheta = useBurnAmountInTheta();
  const onSubmit = useCallback(
    async (state: any) => {
      const { address, amount } = state as SchemaType;
      const baseAmount = convertAmountToBaseUnit(amount.toFixed(), address);

      try {
        setTxStatus('Approving Token Transfer');

        const approvalTx = await approvalOfTransfer(
          address,
          ethers.BigNumber.from(baseAmount),
          config.CHILD_PORTAL_ADDRESS
        );
        if (!approvalTx) {
          return;
        }
        await approvalTx.wait();

        setTxStatus('Bridging Your Tokens');
        const lockTx = await burnAmountInTheta(address, baseAmount);
        if (!lockTx) {
          return;
        }
        await lockTx.wait();
        const bridgeHash = await bridgeToRinkeby(lockTx.hash);

        setTxStatus('Verifying Transfer');
        await rinkebyProvider.waitForTransaction(bridgeHash);

        enqueueSnackbar('Successfully bridged your tokens.', {
          variant: 'success',
        });
        reset();

        queryClient.invalidateQueries('token-balance');
      } catch (err) {
        enqueueSnackbar('Failed to bridge tokens.', {
          variant: 'error',
        });

        throw err;
      } finally {
        setTxStatus(null);
      }
    },
    [approvalOfTransfer, burnAmountInTheta, enqueueSnackbar, queryClient, reset]
  );

  const address = useWatch({ control, name: 'address' });
  const amount = useWatch({ control, name: 'amount' });

  const amountBaseUnit = useMemo(
    () =>
      address && amount ? convertAmountToBaseUnit(amount, address) : undefined,
    [address, amount]
  );

  const tokenAddress = address !== '0x' ? address : undefined;
  const { data: tokenBalance } = useTokenBalance(tokenAddress);

  const isUnderFunded = useMemo(
    () =>
      tokenBalance && amountBaseUnit
        ? tokenBalance.balance.lt(ethers.BigNumber.from(amountBaseUnit))
        : false,
    [tokenBalance, amountBaseUnit]
  );

  const inputAmountUnderFunded = isUnderFunded && 'Token Under Funded';
  const tokenSelect = !tokenAddress && 'Select Token';
  const inputAmount = !amount && 'Input Amount';

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
            disabled={isUnderFunded}
          >
            {txStatus ||
              inputAmountUnderFunded ||
              tokenSelect ||
              inputAmount ||
              'Withdraw'}
          </LoadingButton>
        </ConnectWrapper>
      </Stack>
    </FormProvider>
  );
}
