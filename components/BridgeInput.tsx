import { Box, Input, Stack, Typography, useTheme } from '@mui/material';
import { useTokenBalance } from 'api/token';
import { Token } from 'config/supportedTokens';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { decimalRegex, handleAllowedInput } from 'utils/numeric';
import TokenInput from './TokenInput';

type BridgeInputProps = {
  network: string;
  options: Token[];
};

export default function BridgeInput({ network, options }: BridgeInputProps) {
  const { typography } = useTheme();
  const { control } = useFormContext();

  const address = useWatch({ control, name: 'address' });
  const tokenAddress = address !== '0x' ? address : undefined;
  const { data: balance } = useTokenBalance(tokenAddress);

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
          name="amount"
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
              inputProps={{
                pattern: decimalRegex,
              }}
              {...field}
              disabled={!tokenAddress}
              onChange={(e) => {
                handleAllowedInput(e, field.onChange, field.value);
              }}
            />
          )}
        />

        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <TokenInput
              tokens={options}
              value={field.value}
              onChange={field.onChange}
              disableLogo
            />
          )}
        />
      </Stack>
      <Stack direction="row" spacing={1} justifyContent="space-between">
        <Typography variant="body2" color="textSecondary">
          {network}
        </Typography>
        {balance && (
          <Typography variant="body2" color="textSecondary">
            Balance: {balance.toString()}
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
