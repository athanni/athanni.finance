import { Button, ButtonGroup, Paper, Stack } from '@mui/material';
import { useState } from 'react';
import BridgeDeposit from './BridgeDeposit';
import BridgeWithdraw from './BridgeWithdraw';

export default function Bridger() {
  const [index, setIndex] = useState(0);

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
      <Stack spacing={2}>
        <Stack alignItems="center" mb={2}>
          <ButtonGroup variant="contained" color="inherit">
            <Button
              color={index === 0 ? 'secondary' : undefined}
              sx={{ width: 120 }}
              onClick={() => setIndex(0)}
            >
              Deposit
            </Button>
            <Button
              color={index === 1 ? 'secondary' : undefined}
              sx={{ width: 120 }}
              onClick={() => setIndex(1)}
            >
              Withdraw
            </Button>
          </ButtonGroup>
        </Stack>

        {index === 0 && <BridgeDeposit />}
        {index === 1 && <BridgeWithdraw />}
      </Stack>
    </Paper>
  );
}
