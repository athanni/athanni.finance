import { zodResolver } from '@hookform/resolvers/zod';
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
import { ethers } from 'ethers';
import { useCallback, useMemo } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { materialRegister } from 'utils/materialForm';
import { z } from 'zod';

const schema = z.object({
  token: z.string().min(1, 'Required'),
  address: z
    .string()
    .refine((v) => ethers.utils.isAddress(v), 'Not a valid address'),
});

type SchemaType = z.infer<typeof schema>;

export default function Faucet() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      token: '',
      address: '',
    },
    resolver: zodResolver(schema),
  });

  const token = useWatch({ control, name: 'token' });
  const tok = useMemo(
    () => rinkebyTokens.find((it) => it.address === token),
    [token]
  );

  const onSubmit = useCallback((state: SchemaType) => {
    console.log(state);
  }, []);

  return (
    <>
      <Navigation />
      <Container>
        <Stack alignItems="center" mt={6}>
          <Paper
            component="form"
            variant="outlined"
            sx={{
              px: 4,
              py: 3,
              width: '100%',
              maxWidth: 500,
            }}
            onSubmit={handleSubmit(onSubmit)}
          >
            <Typography fontWeight="medium">Rinkeby Faucet</Typography>

            <Stack mt={4} spacing={2}>
              <Controller
                name="token"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Token"
                    fullWidth
                    select
                    {...field}
                    helperText={errors.token?.message}
                    error={Boolean(errors.token)}
                  >
                    {rinkebyTokens.map((tok) => (
                      <MenuItem key={tok.address} value={tok.address}>
                        {tok.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              <TextField
                label="Your Address"
                fullWidth
                {...materialRegister(register, 'address')}
                helperText={errors.address?.message}
                error={Boolean(errors.address)}
              />

              <Button type="submit" variant="contained" size="large">
                Send Me {tok?.ticker && `100 ${tok.ticker}`}
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </>
  );
}
