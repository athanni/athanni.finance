import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { usePairAddressForTokens, usePoolPair } from 'api/pairs';
import { useAddLiquidity } from 'api/router';
import { useApprovalOfTransfer } from 'api/token';
import BigNumber from 'bignumber.js';
import { DEFAULT_SPLIPPAGE_RATE } from 'config/constants';
import supportedTokens, { tokenMap } from 'config/supportedTokens';
import { ethers } from 'ethers';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useMemo } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { useBoolean } from 'react-use';
import { calculateSlippageMin } from 'utils/slippage';
import { z } from 'zod';
import LiquidityAmountInput from './LiquidityAmountInput';
import PoolInfo from './PoolInfo';
import TokenSelect from './TokenSelect';

const schema = z.object({
  token0: z.string().refine((v) => v !== '0x', 'Required'),
  token1: z.string().refine((v) => v !== '0x', 'Required'),
  token0Deposit: z
    .string()
    .transform((v) => new BigNumber(v))
    .refine((v) => v.gt(0), 'Required'),
  token1Deposit: z
    .string()
    .transform((v) => new BigNumber(v))
    .refine((v) => v.gt(0), 'Required'),
});

type SchemaType = z.infer<typeof schema>;

export default function LiquidityDialog() {
  const [open, toggleOpen] = useBoolean(false);

  const form = useForm({
    defaultValues: {
      // Unselected token address. Putting empty string does not work for default
      // selections.
      token0: '0x',
      token1: '0x',
      token0Deposit: '',
      token1Deposit: '',
    },
    resolver: zodResolver(schema),
  });
  const {
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const token0 = useWatch({ control: form.control, name: 'token0' });
  const token1 = useWatch({ control: form.control, name: 'token1' });

  // Transform the token addresses to valid ones, removing '0x' references and setting
  // null instead.
  const tokenA = token0 !== '0x' ? token0 : undefined;
  const tokenB = token1 !== '0x' ? token1 : undefined;

  const tokenAOptions = useMemo(
    () => supportedTokens.filter((it) => it.address !== tokenB),
    [tokenB]
  );
  const tokenBOptions = useMemo(
    () => supportedTokens.filter((it) => it.address !== tokenA),
    [tokenA]
  );

  // Reset all the other fields if the token selection changes.
  useEffect(() => {
    setValue('token0Deposit', '');
    setValue('token1Deposit', '');
  }, [setValue, tokenA, tokenB]);

  // Reset the form itself on close.
  useEffect(() => {
    if (!open) {
      setValue('token0', '0x');
      setValue('token1', '0x');
    }
  }, [open, setValue]);

  const { data: pairAddress, isLoading: isPairAddressLoading } =
    usePairAddressForTokens(tokenA, tokenB);

  const { enqueueSnackbar } = useSnackbar();

  const approvalOfTransfer = useApprovalOfTransfer();
  const addLiquidity = useAddLiquidity();
  const queryClient = useQueryClient();

  const onSubmit = useCallback(
    async (state: any) => {
      try {
        const { token0, token1, token0Deposit, token1Deposit } =
          state as SchemaType;

        const decimalsA = tokenMap[token0];
        const decimalsB = tokenMap[token1];

        const tokenADeposit = token0Deposit
          .multipliedBy(new BigNumber(10).pow(decimalsA.decimals))
          .integerValue();
        const tokenBDeposit = token1Deposit
          .multipliedBy(new BigNumber(10).pow(decimalsB.decimals))
          .integerValue();
        const amountAMin = calculateSlippageMin(
          tokenADeposit,
          DEFAULT_SPLIPPAGE_RATE
        ).toFixed();
        const amountBMin = calculateSlippageMin(
          tokenBDeposit,
          DEFAULT_SPLIPPAGE_RATE
        ).toFixed();

        // Get the approval for token transfers to add liquidity.
        const approvalTxA = await approvalOfTransfer(
          token0,
          ethers.BigNumber.from(tokenADeposit.toFixed())
        );
        const approvalTxB = await approvalOfTransfer(
          token1,
          ethers.BigNumber.from(tokenBDeposit.toFixed())
        );

        // Wait on the transaction to be confirmed before adding liquidity of the same.
        await Promise.all([approvalTxA?.wait(), approvalTxB?.wait()]);

        const addTx = await addLiquidity({
          tokenA: token0,
          tokenB: token1,
          amountADesired: tokenADeposit.toFixed(),
          amountBDesired: tokenBDeposit.toFixed(),
          amountAMin,
          amountBMin,
        });
        await addTx?.wait();

        // Refetch all the liquidity pairs.
        queryClient.invalidateQueries('all-pairs');
        queryClient.invalidateQueries('all-pooled-pairs');

        enqueueSnackbar('Successfully added liquidity.', {
          variant: 'success',
        });
        toggleOpen(false);
      } catch (err) {
        enqueueSnackbar('Failed to add liquidity.', {
          variant: 'error',
        });
        throw err;
      }
    },
    [addLiquidity, approvalOfTransfer, enqueueSnackbar, queryClient, toggleOpen]
  );

  const { data: pair, isLoading: isPoolPairLoading } = usePoolPair(
    tokenA,
    tokenB
  );

  // Get the ratio based on if there exists a liquidity pair.
  const pairRatio = useMemo(
    () => (pair ? pair.reserveB.tokenRatioWith(pair.reserveA) : null),
    [pair]
  );

  return (
    <>
      <Button variant="contained" onClick={toggleOpen}>
        Add Liquidity
      </Button>

      <Dialog open={open} onClose={toggleOpen} fullWidth>
        <DialogTitle>Add Liquidity</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormProvider {...form}>
              <Typography fontWeight="medium">Select Pair</Typography>
              <Stack direction="row" spacing={2} mt={2}>
                <TokenSelect
                  name="token0"
                  placeholder="First token"
                  tokens={tokenAOptions}
                />
                <TokenSelect
                  name="token1"
                  placeholder="Second token"
                  tokens={tokenBOptions}
                />
              </Stack>

              {tokenA && tokenB && !isPairAddressLoading && !pairAddress && (
                <Alert severity="info" icon={false} sx={{ mt: 2 }}>
                  This is a new pool and it needs to be initialized first before
                  adding liquidity to it. Gas fees will be higher than usual due
                  to initialization. The starting rate of the two tokens will be
                  the ratio at which this pool is initialized.
                </Alert>
              )}

              {tokenA && tokenB && !isPairAddressLoading && pairAddress && (
                <PoolInfo tokenA={tokenA} tokenB={tokenB} />
              )}

              <Typography fontWeight="medium" mt={4}>
                Deposit Amounts
              </Typography>
              <Box mt={2}>
                <LiquidityAmountInput
                  name="token0Deposit"
                  pairName="token1Deposit"
                  priceRatio={pairRatio}
                  isRatioInverse={false}
                  address={tokenA && tokenB && !isPoolPairLoading ? tokenA : ''}
                />
              </Box>
              <Box mt={2}>
                <LiquidityAmountInput
                  name="token1Deposit"
                  pairName="token0Deposit"
                  priceRatio={pairRatio}
                  isRatioInverse
                  address={tokenA && tokenB && !isPoolPairLoading ? tokenB : ''}
                />
              </Box>

              <LoadingButton
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                sx={{ mt: 4 }}
                loading={isSubmitting}
                disabled={isPairAddressLoading}
              >
                Add Liquidity
              </LoadingButton>
            </FormProvider>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
