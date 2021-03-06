import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import { Button, IconButton, Paper, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import {
  useBestSwapAmount,
  useSwapExactTokensForTokens,
  useSwapTokensForExactTokens,
} from 'api/router';
import { useApprovalOfTransfer, useTokenBalance } from 'api/token';
import BigNumber from 'bignumber.js';
import { explorerTransactionUrl } from 'config/config';
import { DEFAULT_SPLIPPAGE_RATE } from 'config/constants';
import { ethers } from 'ethers';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { MdSwapVert } from 'react-icons/md';
import { useQueryClient } from 'react-query';
import { convertAmountToBaseUnit } from 'utils/numeric';
import { calculateSlippageMax, calculateSlippageMin } from 'utils/slippage';
import { z } from 'zod';
import ConnectWrapper from './ConnectWrapper';
import SwapInfo from './SwapInfo';
import SwapInput from './SwapInput';

const schema = z.object({
  editedToken: z.enum(['token0', 'token1']),
  tokenA: z.string().refine((v) => v !== '0x', 'Required'),
  tokenB: z.string().refine((v) => v !== '0x', 'Required'),
  tokenAAmount: z
    .string()
    .transform((v) => new BigNumber(v))
    .refine((v) => v.gt(0), 'Required'),
  tokenBAmount: z
    .string()
    .transform((v) => new BigNumber(v))
    .refine((v) => v.gt(0), 'Required'),
});

type SchemaType = z.infer<typeof schema>;

export default function Swapper() {
  const form = useForm({
    defaultValues: {
      editedToken: '',
      tokenAAmount: '',
      tokenA: '0x',
      tokenBAmount: '',
      tokenB: '0x',
    },
    resolver: zodResolver(schema),
  });

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    reset,
    formState: { isSubmitting },
  } = form;
  const onSwitchInput = useCallback(() => {
    const fields = getValues();
    setValue('tokenAAmount', fields.tokenBAmount);
    setValue('tokenA', fields.tokenB);
    setValue('tokenBAmount', fields.tokenAAmount);
    setValue('tokenB', fields.tokenA);
  }, [getValues, setValue]);

  const tokenA = useWatch({ control, name: 'tokenA' });
  const tokenB = useWatch({ control, name: 'tokenB' });
  const token0 = useMemo(
    () => (tokenA !== '0x' ? tokenA : undefined),
    [tokenA]
  );
  const token1 = useMemo(
    () => (tokenB !== '0x' ? tokenB : undefined),
    [tokenB]
  );

  const tokenAAmount = useWatch({ control, name: 'tokenAAmount' });
  const tokenBAmount = useWatch({ control, name: 'tokenBAmount' });
  const editedToken = useWatch({ control, name: 'editedToken' });

  const tokenABaseUnit = useMemo(
    () =>
      token0 && tokenAAmount
        ? convertAmountToBaseUnit(tokenAAmount, token0)
        : undefined,
    [token0, tokenAAmount]
  );
  const tokenBBaseUnit = useMemo(
    () =>
      token1 && tokenBAmount
        ? convertAmountToBaseUnit(tokenBAmount, token1)
        : undefined,
    [token1, tokenBAmount]
  );

  const swapDirection = editedToken === 'token0' ? 'out' : 'in';
  const { data: path, isLoading: isSwapAmountLoading } = useBestSwapAmount(
    token0,
    token1,
    editedToken === 'token0' ? tokenABaseUnit : tokenBBaseUnit,
    swapDirection
  );

  // Whenever the input or the swap amount changes update the non-edited field.
  useEffect(() => {
    if (!path) {
      setValue(editedToken === 'token0' ? 'tokenBAmount' : 'tokenAAmount', '');
      return;
    }

    const first = path[0];
    const last = path[path.length - 1];

    if (editedToken === 'token0') {
      setValue('tokenBAmount', last.toPlainString());
      return;
    }

    if (editedToken === 'token1') {
      setValue('tokenAAmount', first.toPlainString());
    }
  }, [editedToken, path, setValue]);

  const queryClient = useQueryClient();
  const [txStatus, setTxStatus] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const approvalOfTransfer = useApprovalOfTransfer();
  const swapExactTokensForTokens = useSwapExactTokensForTokens();
  const swapTokensForExactTokens = useSwapTokensForExactTokens();
  const onSubmit = useCallback(
    async (state: any) => {
      if (!path) {
        return;
      }

      try {
        const { editedToken } = state as SchemaType;
        const first = path[0];
        const last = path[path.length - 1];

        let explorerUrl: string | undefined;

        setTxStatus('Approving Token Transfer');

        let swapTx: ethers.ContractTransaction | undefined;
        // Source tokens are exact.
        if (editedToken === 'token0') {
          const amountOutMin = calculateSlippageMin(
            new BigNumber(last.balance.toString()),
            DEFAULT_SPLIPPAGE_RATE
          ).toFixed();

          // Approve the amount that is to be swapped.
          const approvalTx = await approvalOfTransfer(
            first.address,
            first.balance
          );
          await approvalTx?.wait();

          setTxStatus('Swapping Tokens');

          swapTx = await swapExactTokensForTokens({
            amountIn: first.balance.toString(),
            amountOutMin,
            path: path.map((it) => it.address),
          });
        } else {
          // Destination tokens are exact.
          const amountInMax = calculateSlippageMax(
            new BigNumber(first.balance.toString()),
            DEFAULT_SPLIPPAGE_RATE
          ).toFixed();

          // Approve the maximum amount that can be swapped.
          const approvalTx = await approvalOfTransfer(
            first.address,
            ethers.BigNumber.from(amountInMax)
          );
          await approvalTx?.wait();

          setTxStatus('Swapping Tokens');

          swapTx = await swapTokensForExactTokens({
            amountOut: last.balance.toString(),
            amountInMax,
            path: path.map((it) => it.address),
          });
        }

        if (swapTx) {
          explorerUrl = explorerTransactionUrl(swapTx.hash);
        }

        reset();
        enqueueSnackbar('Successfully swapped tokens.', {
          variant: 'success',
          action: () =>
            explorerUrl ? (
              <Button
                component="a"
                color="inherit"
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Transaction
              </Button>
            ) : null,
        });

        await swapTx?.wait();
        queryClient.invalidateQueries('token-balance');
        queryClient.invalidateQueries('all-pooled-pairs');
      } catch (err) {
        enqueueSnackbar('Failed to swap.', {
          variant: 'error',
        });
        throw err;
      } finally {
        setTxStatus(null);
      }
    },
    [
      approvalOfTransfer,
      enqueueSnackbar,
      path,
      queryClient,
      reset,
      swapExactTokensForTokens,
      swapTokensForExactTokens,
    ]
  );

  // Check if the wallet is underfunded for the swap.
  const { data: tokenABalance } = useTokenBalance(token0);
  const isUnderFunded = useMemo(
    () =>
      tokenABalance && tokenABaseUnit
        ? tokenABalance.balance.lt(ethers.BigNumber.from(tokenABaseUnit))
        : false,
    [tokenABalance, tokenABaseUnit]
  );

  const inputAmountUnderFunded = isUnderFunded && 'Token Under Funded';
  const selectToken = (!token0 || !token1) && 'Select Token';
  const targetLarge =
    !isSwapAmountLoading &&
    !tokenAAmount &&
    tokenBAmount &&
    'Swap Target Very Large';
  const inputAmount = (!tokenAAmount || !tokenBAmount) && 'Input Amount';

  return (
    <Paper
      variant="outlined"
      sx={{
        px: 4,
        py: 3,
        width: '100%',
        maxWidth: 500,
      }}
    >
      <Typography fontWeight="medium">Swap</Typography>
      <FormProvider {...form}>
        <Stack component="form" mt={3} onSubmit={handleSubmit(onSubmit)}>
          <SwapInput isTokenA />
          <Stack alignItems="center" my={1}>
            <IconButton sx={{ bgcolor: 'grey.200' }} onClick={onSwitchInput}>
              <MdSwapVert />
            </IconButton>
          </Stack>
          <SwapInput isTokenA={false} />

          {path && <SwapInfo path={path} swapDirection={swapDirection} />}

          <Box mt={3}>
            <ConnectWrapper>
              <LoadingButton
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                loadingPosition="start"
                // Just to shut the error.
                startIcon={<></>}
                loading={isSubmitting}
                disabled={
                  isSwapAmountLoading ||
                  (!tokenAAmount && Boolean(tokenBAmount)) ||
                  isUnderFunded
                }
              >
                {txStatus ||
                  inputAmountUnderFunded ||
                  selectToken ||
                  targetLarge ||
                  inputAmount ||
                  'Swap'}
              </LoadingButton>
            </ConnectWrapper>
          </Box>
        </Stack>
      </FormProvider>
    </Paper>
  );
}
