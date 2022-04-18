import {
  Box,
  Input,
  MenuItem,
  Select,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import rinkebyTokens from 'config/rinkebyTokens.json';
import { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { decimalRegex } from 'utils/numeric';

type BridgeInputProps = {
  network: string;
};

export default function BridgeInputReadonly({ network }: BridgeInputProps) {
  const { typography } = useTheme();
  const { control } = useFormContext();
  const address = useWatch({ control, name: 'address' });
  const amount = useWatch({ control, name: 'amount' });

  const token = useMemo(
    () => rinkebyTokens.find((it) => it.address === address),
    [address]
  );

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

        <Select
          variant="standard"
          size="small"
          disableUnderline
          value={address}
          disabled
          sx={{
            '& .MuiSelect-select': {
              bgcolor: 'grey.200',
              px: 2,
              py: 1,
              borderRadius: 1.5,
            },
          }}
        >
          <MenuItem value="0x">
            <Typography color="textSecondary">-</Typography>
          </MenuItem>
          {token && (
            <MenuItem value={token.address}>
              <Typography color="textSecondary">{token.ticker}</Typography>
            </MenuItem>
          )}
        </Select>
      </Stack>
      <Typography variant="body2" color="textSecondary">
        {network}
      </Typography>
    </Box>
  );
}
