import { Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import ConnectWallet from './ConnectWallet';

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
      <TextField placeholder="0.0" fullWidth sx={{ mt: 3 }} />
      <TextField placeholder="0.0" fullWidth sx={{ mt: 3, mb: 3 }} />
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
    </Paper>
  );
}
