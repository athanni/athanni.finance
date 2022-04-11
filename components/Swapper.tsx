import { Button, Paper, Stack, Typography } from '@mui/material';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { FormProvider, useForm } from 'react-hook-form';
import ConnectWallet from './ConnectWallet';
import SwapInput from './SwapInput';

export default function Swapper() {
  const { active, error } = useWeb3React();
  // It is connected even if wallet not on valid chain id.
  const isConnected = active || error instanceof UnsupportedChainIdError;

  const form = useForm({
    defaultValues: {
      tokenAAmount: '',
      tokenA: '0x',
      tokenBAmount: '',
      tokenB: '0x',
    },
  });

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
      <Typography fontWeight="medium">Swap</Typography>
      <FormProvider {...form}>
        <Stack mt={3} spacing={3}>
          <SwapInput isTokenA />
          <SwapInput isTokenA={false} />
          {isConnected ? (
            <Button variant="contained" fullWidth size="large">
              Swap
            </Button>
          ) : (
            <ConnectWallet
              buttonProps={{
                size: 'large',
                fullWidth: true,
              }}
            />
          )}
        </Stack>
      </FormProvider>
    </Paper>
  );
}
