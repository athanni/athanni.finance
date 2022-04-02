import { Button, Paper, TextField, Typography } from '@mui/material';
import ConnectWallet from './ConnectWallet';

export default function Swapper() {
  return (
    <Paper sx={{ p: 2, width: '100%', maxWidth: 500 }}>
      <Typography variant="h6">Swap</Typography>
      <TextField placeholder="0.0" fullWidth sx={{ mt: 1 }} />
      <TextField placeholder="0.0" fullWidth sx={{ mt: 1, mb: 1 }} />
      <ConnectWallet
        buttonProps={{
          size: 'large',
          fullWidth: true,
        }}
      />
    </Paper>
  );
}
