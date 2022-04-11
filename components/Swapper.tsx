import { Button, IconButton, Paper, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { MdSwapVert } from 'react-icons/md';
import ConnectWallet from './ConnectWallet';
import SwapInfo from './SwapInfo';
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

  const { getValues, setValue } = form;
  const onSwitchInput = useCallback(() => {
    const fields = getValues();
    setValue('tokenAAmount', fields.tokenBAmount);
    setValue('tokenA', fields.tokenB);
    setValue('tokenBAmount', fields.tokenAAmount);
    setValue('tokenB', fields.tokenA);
  }, [getValues, setValue]);

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
        <Stack mt={3}>
          <SwapInput isTokenA />
          <Stack alignItems="center" my={1}>
            <IconButton sx={{ bgcolor: 'grey.200' }} onClick={onSwitchInput}>
              <MdSwapVert />
            </IconButton>
          </Stack>
          <SwapInput isTokenA={false} />

          <SwapInfo />

          <Box mt={3}>
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
          </Box>
        </Stack>
      </FormProvider>
    </Paper>
  );
}
