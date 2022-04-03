import { Button, Paper, TextField, Typography } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import ConnectWallet from './ConnectWallet';

export default function Swapper() {
  const { active, chainId, account } = useWeb3React();

  return (
    <Paper sx={{ p: 2, width: '100%', maxWidth: 500 }}>
      <Typography variant="h6">Swap</Typography>
      <TextField placeholder="0.0" fullWidth sx={{ mt: 1 }} />
      <TextField placeholder="0.0" fullWidth sx={{ mt: 1, mb: 1 }} />
      {!(active && chainId && account) && (
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
