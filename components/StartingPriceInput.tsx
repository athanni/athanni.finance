import { TextField, useTheme } from '@mui/material';
import BigNumber from 'bignumber.js';
import { Controller, useFormContext } from 'react-hook-form';
import { decimalRegex, handleAllowedInput } from 'utils/numeric';

type StartingPriceInput = {
  disabled?: boolean;
};

export default function StartingPriceInput({ disabled }: StartingPriceInput) {
  const { control, getValues, setValue } = useFormContext();
  const theme = useTheme();

  return (
    <Controller
      name="startingPrice"
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          fullWidth
          {...field}
          inputProps={{
            pattern: decimalRegex,
          }}
          onChange={(e) => {
            handleAllowedInput(e, field.onChange, field.value);

            // Update the deposit amounts based on the changing starting price.
            handleAllowedInput(
              e,
              (v) => {
                const { token0Deposit } = getValues();
                const tokenADeposit = new BigNumber(token0Deposit);
                setValue(
                  'token1Deposit',
                  tokenADeposit.isNaN() ? '' : tokenADeposit.multipliedBy(v)
                );
              },
              field.value
            );
          }}
          InputProps={{
            sx: {
              fontSize: theme.typography.h6.fontSize,
              fontWeight: 'medium',
            },
          }}
          placeholder="0.0"
          disabled={disabled}
          error={Boolean(fieldState.error)}
        />
      )}
    />
  );
}
