import { Box, Input, Stack, Typography, useTheme } from '@mui/material';
import { resolveToken } from 'config/supportedTokens';
import { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { decimalRegex } from 'utils/numeric';
import TokenInput from './TokenInput';

type BridgeInputProps = {
  network: string;
};

export default function BridgeInputReadonly({ network }: BridgeInputProps) {
  const { typography } = useTheme();
  const { control } = useFormContext();
  const address = useWatch({ control, name: 'address' });
  const amount = useWatch({ control, name: 'amount' });
  const token = useMemo(() => resolveToken(address), [address]);

  return (
    <Box
      bgcolor="grey.100"
      px={2}
      py={1.5}
      borderRadius={1.5}
      border="1px solid"
      borderColor="grey.400"
    >
      <Stack
        direction="row"
        spacing={1}
        justifyContent="space-between"
        alignItems="center"
      >
        <Input
          placeholder="0.0"
          disableUnderline
          fullWidth
          disabled
          value={amount}
          sx={{
            fontSize: typography.h5.fontSize,
            fontWeight: 'medium',
          }}
          inputProps={{
            pattern: decimalRegex,
          }}
        />

        <TokenInput
          tokens={token ? [token] : []}
          value={token?.address ?? ''}
        />
      </Stack>
      <Typography variant="body2" color="textSecondary">
        {network}
      </Typography>
    </Box>
  );
}
