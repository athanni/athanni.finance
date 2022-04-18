import {
  Box,
  Input,
  MenuItem,
  Select,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { Token } from 'config/supportedTokens';
import { Controller, useFormContext } from 'react-hook-form';
import { materialRegister } from 'utils/materialForm';
import { decimalRegex } from 'utils/numeric';

type BridgeInputProps = {
  network: string;
  options: Token[];
};

export default function BridgeInput({ network, options }: BridgeInputProps) {
  const { typography } = useTheme();
  const { control } = useFormContext();

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
            />
          )}
        />

        <Controller
          name="address"
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
              {options.map((opt) => (
                <MenuItem key={opt.address} value={opt.address}>
                  {opt.ticker}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </Stack>
      <Stack direction="row" spacing={1} justifyContent="space-between">
        <Typography variant="body2" color="textSecondary">
          {network}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Balance: 5,000.3232
        </Typography>
      </Stack>
    </Box>
  );
}
