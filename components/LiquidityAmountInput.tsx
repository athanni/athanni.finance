import { Box, Button, Input, Stack, useTheme } from '@mui/material';
import supportedTokens from 'config/supportedTokens';
import { useMemo } from 'react';

type LiquidityAmountInputProps = {
  address: string;
};

export default function LiquidityAmountInput({
  address,
}: LiquidityAmountInputProps) {
  const { typography } = useTheme();

  const token = useMemo(
    () => supportedTokens.find((token) => token.address === address),
    [address]
  );

  return (
    <Box bgcolor="grey.100" px={2} py={1.5} borderRadius={1.5}>
      <Stack
        direction="row"
        spacing={1}
        justifyContent="space-between"
        alignItems="center"
      >
        <Input
          disableUnderline
          fullWidth
          placeholder="0.0"
          sx={{
            fontSize: typography.h5.fontSize,
            fontWeight: 'medium',
          }}
        />

        <Button variant="contained" color="inherit" disabled={!token}>
          {token?.ticker ?? 'UNSET'}
        </Button>
      </Stack>
    </Box>
  );
}
