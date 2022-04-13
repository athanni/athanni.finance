import { MenuItem, Stack, TextField, Typography } from '@mui/material';
import { Token } from 'config/supportedTokens';
import { Controller, useFormContext } from 'react-hook-form';

type TokenSelectProps = {
  name: string;
  placeholder: string;
  tokens: Token[];
  disabled?: boolean;
};

export default function TokenSelect({
  name,
  placeholder,
  tokens,
  disabled,
}: TokenSelectProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          select
          fullWidth
          value={field.value}
          onChange={field.onChange}
          inputRef={field.ref}
          error={Boolean(fieldState.error)}
          disabled={disabled}
        >
          <MenuItem value="0x">
            <Stack>
              <Typography>Select a token</Typography>
              <Typography variant="caption" color="textSecondary">
                {placeholder}
              </Typography>
            </Stack>
          </MenuItem>
          {tokens.map((token) => (
            <MenuItem key={token.address} value={token.address}>
              <Stack>
                <Typography>{token.ticker}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {token.name}
                </Typography>
              </Stack>
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
}
