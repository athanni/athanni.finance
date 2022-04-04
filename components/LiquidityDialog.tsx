import {
  Alert,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import supportedTokens from 'config/supportedTokens';
import { useMemo } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useBoolean } from 'react-use';
import { materialRegister } from 'utils/materialForm';
import CurrencyInput from './CurrencyInput';
import LiquidityAmountInput from './LiquidityAmountInput';
import TokenSelect from './TokenSelect';

export default function LiquidityDialog() {
  const [open, toggleOpen] = useBoolean(false);

  const form = useForm({
    defaultValues: {
      token0: '',
      token1: '',
      startingPrice: '',
      token0Deposit: '',
      token1Deposit: '',
    },
  });
  const { register } = form;

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
              <TokenSelect name="token0" tokens={token0Options} />
              <TokenSelect name="token1" tokens={token1Options} />
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
            <TextField
              fullWidth
              sx={{ mt: 2 }}
              {...materialRegister(register, 'startingPrice')}
            />

            <Typography fontWeight="medium" mt={4}>
              Deposit Amounts
            </Typography>
            <Box mt={2}>
              <LiquidityAmountInput address={token0} />
            </Box>
            <Box mt={2}>
              <LiquidityAmountInput address={token1} />
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
