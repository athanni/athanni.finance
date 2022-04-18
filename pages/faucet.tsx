import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Container,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { sendTokens } from 'api/faucet';
import Navigation from 'components/Navigation';
import rinkebyTokens from 'config/rinkebyTokens.json';
import { ethers } from 'ethers';
import { useSnackbar } from 'notistack';
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
    formState: { errors, isSubmitting },
    reset,
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

  const { enqueueSnackbar } = useSnackbar();
  const onSubmit = useCallback(
    async (state: SchemaType) => {
      try {
        await sendTokens(state.address, state.token);
        enqueueSnackbar(
          `Successfully sent 100 ${tok!.ticker} to your address.`,
          {
            variant: 'success',
          }
        );
        reset();
      } catch (err) {
        enqueueSnackbar(`Failed to send tokens.`, {
          variant: 'error',
        });
      }
    },
    [enqueueSnackbar, reset, tok]
  );

  const { connector } = useWeb3React();
  // Shows the token in the Metamask list.
  const onAddToken = useCallback(async () => {
    if (!connector) {
      return;
    }

    await (connector.provider as any).request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: tok!.address,
          symbol: tok!.ticker,
          decimals: tok!.decimals,
        },
      },
    });
  }, [connector, tok]);

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
              <Box>
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
                {tok && (
                  <Stack alignItems="flex-end">
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{ mt: 0.5 }}
                      onClick={onAddToken}
                    >
                      Add Token
                    </Button>
                  </Stack>
                )}
              </Box>

              <TextField
                label="Your Address"
                fullWidth
                {...materialRegister(register, 'address')}
                helperText={errors.address?.message}
                error={Boolean(errors.address)}
              />

              <LoadingButton
                type="submit"
                variant="contained"
                size="large"
                loading={isSubmitting}
              >
                Send Me {tok?.ticker && `100 ${tok.ticker}`}
              </LoadingButton>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </>
  );
}
