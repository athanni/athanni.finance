import { Box, Input, Stack, Typography, useTheme } from '@mui/material';
import { useSwappableTokens } from 'api/pairs';
import { useTokenBalance } from 'api/token';
import { resolveToken, Token } from 'config/supportedTokens';
import { useMemo } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { decimalRegex, handleAllowedInput } from 'utils/numeric';
import TokenInput from './TokenInput';

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
  const tokenAddressSanitized: string | undefined =
    tokenAddress !== '0x' ? tokenAddress : undefined;
  const { data: tokenBalance } = useTokenBalance(tokenAddressSanitized);

  const pairTokenAddress = useWatch({ control, name: pairTokenName });

  const { data: swappableTokens } = useSwappableTokens();
  const tokenList = useMemo(
    () =>
      swappableTokens
        .filter((token) => token !== pairTokenAddress)
        .map((token) => resolveToken(token))
        .filter((token) => Boolean(token)),
    [pairTokenAddress, swappableTokens]
  ) as Token[];

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
              disabled={!tokenAddressSanitized}
              {...field}
              inputProps={{
                pattern: decimalRegex,
              }}
              onChange={(e) => {
                handleAllowedInput(e, field.onChange, field.value);
                setValue('editedToken', tokenAddress);
              }}
            />
          )}
        />

        <Controller
          name={tokenName}
          control={control}
          render={({ field }) => (
            <TokenInput
              tokens={tokenList}
              value={field.value}
              onChange={field.onChange}
            />
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
