import { MenuItem, Stack, TextField, Typography } from '@mui/material';
import { Token } from 'config/supportedTokens';
import { Controller, useFormContext } from 'react-hook-form';

type TokenSelectProps = {
  name: string;
  tokens: Token[];
};

export default function TokenSelect({ name, tokens }: TokenSelectProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          select
          fullWidth
          value={field.value}
          onChange={field.onChange}
          inputRef={field.ref}
        >
          {tokens.map((token) => (
            <MenuItem key={token.address} value={token.address}>
              <Stack>
                <Typography variant="body2">{token.ticker}</Typography>
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
