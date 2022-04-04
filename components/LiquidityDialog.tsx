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
  const token0Options = useMemo(
    () => supportedTokens.filter((it) => it.address !== token1),
    [token1]
  );
  const token1Options = useMemo(
    () => supportedTokens.filter((it) => it.address !== token0),
    [token0]
  );

  // Reset all other fields if the token are not selected.
  useEffect(() => {
    if (token0 === '0x' || token1 === '0x') {
      // Reset all other fields.
      setValue('startingPrice', '');
      setValue('token0Deposit', '');
      setValue('token1Deposit', '');
    }
  }, [setValue, token0, token1]);

  // Reset the form itself on close.
  useEffect(() => {
    if (!open) {
      setValue('token0', '0x');
      setValue('token1', '0x');
    }
  }, [open, setValue]);

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
                tokens={token0Options}
              />
              <TokenSelect
                name="token1"
                placeholder="Second token"
                tokens={token1Options}
              />
            </Stack>
            <Alert severity="info" icon={false} sx={{ mt: 2 }}>
              This is a new pool and it needs to be initialized first before
              adding liquidity to it. To initialize input the starting price for
              the pool and the deposit amount. Gas fees will be higher than
              usual due to initialization.
            </Alert>

            <Typography fontWeight="medium" mt={4}>
              Set Starting Price
            </Typography>
            <Box mt={2}>
              <PriceInput
                name="startingPrice"
                disabled={token0 === '0x' || token1 === '0x'}
              />
            </Box>

            <Typography fontWeight="medium" mt={4}>
              Deposit Amounts
            </Typography>
            <Box mt={2}>
              <LiquidityAmountInput
                name="token0Deposit"
                address={token0 !== '0x' && token1 !== '0x' ? token0 : ''}
              />
            </Box>
            <Box mt={2}>
              <LiquidityAmountInput
                name="token1Deposit"
                address={token0 !== '0x' && token1 !== '0x' ? token1 : ''}
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
