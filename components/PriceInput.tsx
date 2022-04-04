import { TextField, useTheme } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { handleDecimalInput } from 'utils/numeric';

type PriceInputProps = {
  name: string;
};

export default function PriceInput({ name }: PriceInputProps) {
  const { control } = useFormContext();
  const theme = useTheme();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
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
        />
      )}
    />
  );
}
