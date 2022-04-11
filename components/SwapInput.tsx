import {
  Box,
  Input,
  MenuItem,
  Select,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import supportedTokens from 'config/supportedTokens';
import { Controller, useFormContext } from 'react-hook-form';
import { handleDecimalInput } from 'utils/numeric';

type CurrencyInputProps = {
  isTokenA: boolean;
};

export default function SwapInput({ isTokenA }: CurrencyInputProps) {
  const { typography } = useTheme();
  const name = isTokenA ? 'tokenAAmount' : 'tokenBAmount';
  const tokenName = isTokenA ? 'tokenA' : 'tokenB';
  const { control } = useFormContext();

  return (
    <Box bgcolor="grey.100" px={2} py={1.5} borderRadius={1.5}>
      <Stack
        direction="row"
        spacing={1}
        justifyContent="space-between"
        alignItems="center"
      >
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Input
              disableUnderline
              fullWidth
              sx={{
                fontSize: typography.h5.fontSize,
                fontWeight: 'medium',
              }}
              {...field}
              onChange={(e) => {
                handleDecimalInput(e, field.onChange);
              }}
            />
          )}
        />

        <Controller
          name={tokenName}
          control={control}
          render={({ field }) => (
            <Select
              variant="standard"
              size="small"
              disableUnderline
              sx={{
                '& .MuiSelect-select': {
                  bgcolor: 'grey.200',
                  px: 2,
                  py: 1,
                  borderRadius: 1.5,
                },
              }}
              value={field.value}
              onChange={field.onChange}
            >
              <MenuItem value="0x">
                <Typography color="textSecondary">-</Typography>
              </MenuItem>
              {supportedTokens.map((token) => (
                <MenuItem key={token.address} value={token.address}>
                  {token.ticker}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </Stack>
      <Stack direction="row" spacing={1} justifyContent="space-between">
        <Typography variant="body2" color="textSecondary">
          $12,121.4
        </Typography>

        <Typography variant="body2" color="textSecondary">
          Balance: 0
        </Typography>
      </Stack>
    </Box>
  );
}
