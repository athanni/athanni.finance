import {
  Button,
  Container,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Navigation from 'components/Navigation';
import rinkebyTokens from 'config/rinkebyTokens.json';
import { useMemo } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

export default function Faucet() {
  const { control } = useForm({
    defaultValues: {
      token: '',
    },
  });
  const token = useWatch({ control, name: 'token' });
  const tok = useMemo(
    () => rinkebyTokens.find((it) => it.address === token),
    [token]
  );

  return (
    <>
      <Navigation />
      <Container>
        <Stack alignItems="center" mt={6}>
          <Paper
            variant="outlined"
            sx={{
              px: 4,
              py: 3,
              width: '100%',
              maxWidth: 500,
            }}
          >
            <Typography fontWeight="medium">Faucet</Typography>

            <Stack mt={4} spacing={2}>
              <Controller
                name="token"
                control={control}
                render={({ field }) => (
                  <TextField label="Your Address" fullWidth select {...field}>
                    {rinkebyTokens.map((tok) => (
                      <MenuItem key={tok.address} value={tok.address}>
                        {tok.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <Button variant="contained" size="large" disabled={!tok}>
                Send Me {tok?.ticker && `100 ${tok.ticker}`}
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </>
  );
}
