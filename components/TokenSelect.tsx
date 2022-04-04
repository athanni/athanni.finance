import { MenuItem, Stack, TextField, Typography } from '@mui/material';
import { Token } from 'config/supportedTokens';
import { Controller, useFormContext } from 'react-hook-form';

type TokenSelectProps = {
  name: string;
  placeholder: string;
  tokens: Token[];
};

export default function TokenSelect({
  name,
  placeholder,
  tokens,
}: TokenSelectProps) {
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