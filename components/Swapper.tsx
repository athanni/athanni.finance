import { Button, Paper, Stack, Typography } from '@mui/material';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import ConnectWallet from './ConnectWallet';
import CurrencyInput from './CurrencyInput';

export default function Swapper() {
  const { active, error } = useWeb3React();
  // It is connected even if wallet not on valid chain id.
  const isConnected = active || error instanceof UnsupportedChainIdError;

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
      <Stack mt={3} spacing={3}>
        <CurrencyInput />
        <CurrencyInput />
        {isConnected ? (
          <Button variant="contained" fullWidth size="large">
            Swap
          </Button>
        ) : (
          <ConnectWallet
            buttonProps={{
              size: 'large',
              fullWidth: true,
            }}
          />
        )}
      </Stack>
    </Paper>
  );
}
