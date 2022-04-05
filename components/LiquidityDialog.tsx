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
import { usePairAddressForTokens } from 'api/pairs';
import { useAddLiquidity } from 'api/router';
import BigNumber from 'bignumber.js';
import { DEFAULT_SPLIPPAGE_RATE } from 'config/constants';
import supportedTokens, { tokenMap } from 'config/supportedTokens';
import { ethers } from 'ethers';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useMemo } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useBoolean } from 'react-use';
import { calculateSlippageMin } from 'utils/slippage';
import { z } from 'zod';
import LiquidityAmountInput from './LiquidityAmountInput';
import PriceInput from './PriceInput';
import TokenSelect from './TokenSelect';

const schema = z
  .object({
    token0: z.string().refine((v) => v !== '0x', 'Required'),
    token1: z.string().refine((v) => v !== '0x', 'Required'),
    hasPair: z.boolean(),
    startingPrice: z.string().transform((v) => new BigNumber(v)),
    token0Deposit: z
      .string()
      .transform((v) => new BigNumber(v))
      .refine((v) => v.gt(0), 'Required'),
    token1Deposit: z
      .string()
      .transform((v) => new BigNumber(v))
      .refine((v) => v.gt(0), 'Required'),
  })
  .refine((arg) => !arg.hasPair && arg.startingPrice.gt(0), {
    message: 'Required',
    path: ['startingPrice'],
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
      hasPair: false,
      startingPrice: '',
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

  // Reset all other fields if the token are not selected.
  useEffect(() => {
    if (!tokenA || !tokenB) {
      // Reset all other fields.
      setValue('startingPrice', '');
      setValue('token0Deposit', '');
      setValue('token1Deposit', '');
    }
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

  // Set the form state for validations to run if no pair address exists.
  useEffect(() => {
    setValue('hasPair', !isPairAddressLoading && Boolean(pairAddress));
  }, [isPairAddressLoading, pairAddress, setValue]);

  const { enqueueSnackbar } = useSnackbar();

  const addLiquidity = useAddLiquidity();
  const onSubmit = useCallback(
    async (state: any) => {
      try {
        const { token0, token1, token0Deposit, token1Deposit } =
          state as SchemaType;

        const decimalsA = tokenMap[token0];
        const decimalsB = tokenMap[token1];

        const tokenADeposit = ethers.BigNumber.from(
          token0Deposit
            .multipliedBy(new BigNumber(10).pow(decimalsA.decimals))
            .toFixed()
        );
        const tokenBDeposit = ethers.BigNumber.from(
          token1Deposit
            .multipliedBy(new BigNumber(10).pow(decimalsB.decimals))
            .toFixed()
        );

        const amountAMin = calculateSlippageMin(
          tokenADeposit,
          DEFAULT_SPLIPPAGE_RATE
        );
        const amountBMin = calculateSlippageMin(
          tokenBDeposit,
          DEFAULT_SPLIPPAGE_RATE
        );

        await addLiquidity({
          tokenA: token0,
          tokenB: token1,
          amountADesired: tokenADeposit,
          amountBDesired: tokenBDeposit,
          amountAMin,
          amountBMin,
        });
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
    [addLiquidity, enqueueSnackbar, toggleOpen]
  );

  // TODO: Handle the ratio based on the market price for existing pairs.
  const startingPrice = useWatch({ control, name: 'startingPrice' });
  const startingPriceBig = useMemo(
    () => new BigNumber(startingPrice),
    [startingPrice]
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
                <>
                  <Alert severity="info" icon={false} sx={{ mt: 2 }}>
                    This is a new pool and it needs to be initialized first
                    before adding liquidity to it. To initialize input the
                    starting price for the pool and the deposit amount. Gas fees
                    will be higher than usual due to initialization.
                  </Alert>

                  <Typography fontWeight="medium" mt={4}>
                    Set Starting Price
                  </Typography>
                  <Box mt={2}>
                    <PriceInput
                      name="startingPrice"
                      disabled={!tokenA || !tokenB}
                    />
                  </Box>
                </>
              )}

              <Typography fontWeight="medium" mt={4}>
                Deposit Amounts
              </Typography>
              <Box mt={2}>
                <LiquidityAmountInput
                  name="token0Deposit"
                  pairName="token1Deposit"
                  priceRatio={startingPriceBig}
                  isRatioInverse={false}
                  address={tokenA && tokenB ? tokenA : ''}
                />
              </Box>
              <Box mt={2}>
                <LiquidityAmountInput
                  name="token1Deposit"
                  pairName="token0Deposit"
                  priceRatio={startingPriceBig}
                  isRatioInverse
                  address={tokenA && tokenB ? tokenB : ''}
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
