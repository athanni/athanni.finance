import { Box, Button, Input, Stack, Typography, useTheme } from '@mui/material';
import { red } from '@mui/material/colors';
import { useTokenBalance } from 'api/token';
import BigNumber from 'bignumber.js';
import supportedTokens from 'config/supportedTokens';
import { useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { handleDecimalInput } from 'utils/numeric';

type LiquidityAmountInputProps = {
  name: string;
  pairName: string;
  priceRatio: BigNumber;
  address: string;
};

export default function LiquidityAmountInput({
  name,
  pairName,
  priceRatio,
  address,
}: LiquidityAmountInputProps) {
  const { typography } = useTheme();

  const token = useMemo(
    () => supportedTokens.find((token) => token.address === address),
    [address]
  );
  const { data: tokenBalance } = useTokenBalance(address);

  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  return (
    <Box
      bgcolor="grey.100"
      border="1px solid"
      borderColor={errors[name] ? red[700] : 'grey.400'}
      px={2}
      py={1.5}
      borderRadius={1.5}
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
              disableUnderline
              fullWidth
              placeholder="0.0"
              sx={{
                fontSize: typography.h5.fontSize,
                fontWeight: 'medium',
              }}
              {...field}
              onChange={(e) => {
                handleDecimalInput(e, field.onChange);
                handleDecimalInput(e, (event) => {
                  const v = new BigNumber(e.target.value);
                  const pairValue = v.multipliedBy(priceRatio);
                  setValue(
                    pairName,
                    pairValue.isNaN() ? '0' : pairValue.toString()
                  );
                });
              }}
              disabled={!token}
            />
          )}
        />

        <Button variant="contained" color="inherit" disabled={!token}>
          {token?.ticker ?? 'UNSET'}
        </Button>
      </Stack>

      <Stack direction="row" justifyContent="flex-end">
        {tokenBalance && (
          <Typography variant="body2" color="textSecondary">
            Balance: {tokenBalance.toString()}
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
