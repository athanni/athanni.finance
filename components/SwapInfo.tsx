import { Paper, Stack, Typography } from '@mui/material';
import { MdKeyboardArrowRight } from 'react-icons/md';

export default function SwapInfo() {
  return (
    <Paper variant="outlined" sx={{ mt: 3, px: 2, py: 1, bgcolor: 'grey.100' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body2">Swap rate</Typography>
        <Typography fontWeight="medium">1 TOK = 5 MAC</Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body2">Router</Typography>
        <Typography fontWeight="medium" display="flex" alignItems="center">
          TOK <MdKeyboardArrowRight /> MAC
        </Typography>
      </Stack>
    </Paper>
  );
}
