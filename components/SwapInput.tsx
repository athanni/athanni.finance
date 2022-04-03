import {
  Box,
  Input,
  MenuItem,
  Select,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';

export default function SwapInput() {
  const { typography } = useTheme();

  return (
    <Box bgcolor="grey.100" px={2} py={1.5} borderRadius={1.5}>
      <Stack
        direction="row"
        spacing={1}
        justifyContent="space-between"
        alignItems="center"
      >
        <Input
          disableUnderline
          fullWidth
          sx={{
            fontSize: typography.h5.fontSize,
            fontWeight: 'medium',
          }}
        />

        <Select
          variant="standard"
          value="ETH"
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
        >
          <MenuItem value="ETH">ETH</MenuItem>
          <MenuItem value="BTC">BTC</MenuItem>
          <MenuItem value="THETA">THETA</MenuItem>
          <MenuItem value="TFUEL">TFUEL</MenuItem>
        </Select>
      </Stack>
      <Stack direction="row" spacing={1} justifyContent="space-between">
        <Typography variant="body2" color="textSecondary">
          $12,121.4
        </Typography>

        <Typography variant="body2" color="textSecondary">
          Balance: 0
        </Typography>
      </Stack>
    </Box>
  );
}
