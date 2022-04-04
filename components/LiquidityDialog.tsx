import {
  Alert,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { usePairAddressForTokens } from 'api/pairs';
import supportedTokens from 'config/supportedTokens';
import { useEffect, useMemo } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useBoolean } from 'react-use';
import LiquidityAmountInput from './LiquidityAmountInput';
import PriceInput from './PriceInput';
import TokenSelect from './TokenSelect';

export default function LiquidityDialog() {
  const [open, toggleOpen] = useBoolean(false);

  const form = useForm({
    defaultValues: {
      // Unselected token address. Putting empty string does not work for default
      // selections.
      token0: '0x',
      token1: '0x',
      startingPrice: '',
      token0Deposit: '',
      token1Deposit: '',
    },
  });
  const { setValue } = form;

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

  return (
    <>
      <Button variant="contained" onClick={toggleOpen}>
        Add Liquidity
      </Button>

      <Dialog open={open} onClose={toggleOpen} fullWidth>
        <DialogTitle>Add Liquidity</DialogTitle>
        <DialogContent>
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
                adding liquidity to it. To initialize input the starting price
                for the pool and the deposit amount. Gas fees will be higher
                than usual due to initialization.
              </Alert>
            )}

            <Typography fontWeight="medium" mt={4}>
              Set Starting Price
            </Typography>
            <Box mt={2}>
              <PriceInput name="startingPrice" disabled={!tokenA || !tokenB} />
            </Box>

            <Typography fontWeight="medium" mt={4}>
              Deposit Amounts
            </Typography>
            <Box mt={2}>
              <LiquidityAmountInput
                name="token0Deposit"
                address={tokenA && tokenB ? tokenA : ''}
              />
            </Box>
            <Box mt={2}>
              <LiquidityAmountInput
                name="token1Deposit"
                address={tokenA && tokenB ? tokenB : ''}
              />
            </Box>

            <Button variant="contained" fullWidth size="large" sx={{ mt: 4 }}>
              Add
            </Button>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </>
  );
}
