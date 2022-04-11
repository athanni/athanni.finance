import {
  Box,
  Input,
  MenuItem,
  Select,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { useSwappableTokens } from 'api/pairs';
import { useTokenBalance } from 'api/token';
import { tokenMap } from 'config/supportedTokens';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { handleDecimalInput } from 'utils/numeric';

type CurrencyInputProps = {
  isTokenA: boolean;
};

export default function SwapInput({ isTokenA }: CurrencyInputProps) {
  const { typography } = useTheme();
  const name = isTokenA ? 'tokenAAmount' : 'tokenBAmount';
  const tokenName = isTokenA ? 'tokenA' : 'tokenB';
  const pairTokenName = isTokenA ? 'tokenB' : 'tokenA';
  const { control, setValue } = useFormContext();

  const tokenAddress = useWatch({ control, name: tokenName });
  const { data: tokenBalance } = useTokenBalance(tokenAddress);

  const pairTokenAddress = useWatch({ control, name: pairTokenName });

  const { data: swappableTokens } = useSwappableTokens();

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
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Input
              placeholder="0.0"
              disableUnderline
              fullWidth
              sx={{
                fontSize: typography.h5.fontSize,
                fontWeight: 'medium',
              }}
              disabled={tokenAddress === '0x'}
              {...field}
              onChange={(e) => {
                handleDecimalInput(e, field.onChange);
                setValue('editedToken', tokenAddress);
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
              {swappableTokens
                .filter((token) => token !== pairTokenAddress)
                .filter((token) => Boolean(tokenMap[token]))
                .map((token) => (
                  <MenuItem key={token} value={token}>
                    {tokenMap[token].ticker}
                  </MenuItem>
                ))}
            </Select>
          )}
        />
      </Stack>
      {tokenBalance && (
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Typography variant="body2" color="textSecondary">
            Balance: {tokenBalance.toString()}
          </Typography>
        </Stack>
      )}
    </Box>
  );
}
