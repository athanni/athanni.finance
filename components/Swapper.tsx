import { Paper, TextField, Typography } from '@mui/material';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import ConnectWallet from './ConnectWallet';

export default function Swapper() {
  const { active, error } = useWeb3React();
  // It is connected even if wallet not on valid chain id.
  const isConnected = active || error instanceof UnsupportedChainIdError;

  return (
    <Paper sx={{ p: 2, width: '100%', maxWidth: 500 }}>
      <Typography variant="h6">Swap</Typography>
      <TextField placeholder="0.0" fullWidth sx={{ mt: 1 }} />
      <TextField placeholder="0.0" fullWidth sx={{ mt: 1, mb: 1 }} />
      {!isConnected && (
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
