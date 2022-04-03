import { Button, Paper, Stack, Typography } from '@mui/material';

export default function Pooler() {
  return (
    <>
      <Paper
        variant="outlined"
        sx={{
          px: 4,
          py: 3,
          width: '100%',
          maxWidth: 500,
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography fontWeight="medium">Pool</Typography>
          <Button variant="contained">Add Liquidity</Button>
        </Stack>
        <Typography textAlign="center" color="textSecondary" mt={12} mb={10}>
          Your active liquidity positions will appear here.
        </Typography>
      </Paper>
    </>
  );
}
