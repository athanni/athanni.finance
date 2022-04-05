import { TextField, useTheme } from '@mui/material';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { handleDecimalInput } from 'utils/numeric';

type PriceInputProps = {
  name: string;
  disabled?: boolean;
};

export default function PriceInput({ name, disabled }: PriceInputProps) {
  const { control } = useFormContext();
  const theme = useTheme();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          fullWidth
          {...field}
          onChange={(e) => handleDecimalInput(e, field.onChange)}
          InputProps={{
            sx: {
              fontSize: theme.typography.h6.fontSize,
              fontWeight: 'medium',
            },
          }}
          disabled={disabled}
          error={Boolean(fieldState.error)}
        />
      )}
    />
  );
}
