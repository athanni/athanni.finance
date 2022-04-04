import {
  Alert,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import supportedTokens from 'config/supportedTokens';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'react-use';
import { materialRegister } from 'utils/materialForm';
import CurrencyInput from './CurrencyInput';

export default function LiquidityDialog() {
  const [open, toggleOpen] = useBoolean(false);

  const { register } = useForm({
    defaultValues: {
      token0: '',
      token1: '',
      startingPrice: '',
      token0Deposit: '',
      token1Deposit: '',
    },
  });

  return (
    <>
      <Button variant="contained" onClick={toggleOpen}>
        Add Liquidity
      </Button>

      <Dialog open={open} onClose={toggleOpen} fullWidth>
        <DialogTitle>Add Liquidity</DialogTitle>
        <DialogContent>
          <Typography fontWeight="medium">Select Pair</Typography>
          <Stack direction="row" spacing={2} mt={2}>
            <TextField select fullWidth>
              {supportedTokens.map((token) => (
                <MenuItem key={token.address} value={token.ticker}>
                  <Stack>
                    <Typography variant="body2">{token.ticker}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {token.name}
                    </Typography>
                  </Stack>
                </MenuItem>
              ))}
            </TextField>
            <TextField select fullWidth>
              {supportedTokens.map((token) => (
                <MenuItem key={token.address} value={token.ticker}>
                  <Stack>
                    <Typography variant="body2">{token.ticker}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {token.name}
                    </Typography>
                  </Stack>
                </MenuItem>
              ))}
            </TextField>
          </Stack>
          <Alert severity="info" icon={false} sx={{ mt: 2 }}>
            This is a new pool and it needs to be initialized first before
            adding liquidity to it. To initialize input the starting price for
            the pool and the deposit amount. Gas fees will be higher than usual
            due to initialization.
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
            <CurrencyInput disableCurrencySelection />
          </Box>
          <Box mt={2}>
            <CurrencyInput disableCurrencySelection />
          </Box>

          <Button variant="contained" fullWidth size="large" sx={{ mt: 4 }}>
            Add
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
