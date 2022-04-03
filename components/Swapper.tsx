import { Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import ConnectWallet from './ConnectWallet';
import SwapInput from './SwapInput';

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
        <SwapInput />
        <SwapInput />
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
