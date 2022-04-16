import {
  Button,
  ButtonGroup,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

export default function Bridger() {
  return (
    <Paper
      variant="outlined"
      sx={{
        px: 4,
        py: 3,
        width: '100%',
        maxWidth: 500,
      }}
    >
      <Stack spacing={2}>
        <Stack alignItems="center" mb={2}>
          <ButtonGroup variant="contained" color="inherit">
            <Button color="secondary" sx={{ width: 120 }}>
              Deposit
            </Button>
            <Button sx={{ width: 120 }}>Withdraw</Button>
          </ButtonGroup>
        </Stack>

        <TextField />
        <TextField />
        <Button variant="contained" size="large">
          Deposit
        </Button>
      </Stack>
    </Paper>
  );
}
