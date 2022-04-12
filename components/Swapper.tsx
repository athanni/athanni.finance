import { zodResolver } from '@hookform/resolvers/zod';
import { Button, IconButton, Paper, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { useBestSwapAmount } from 'api/router';
import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useMemo } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { MdSwapVert } from 'react-icons/md';
import { convertAmountToBaseUnit } from 'utils/numeric';
import { z } from 'zod';
import ConnectWallet from './ConnectWallet';
import SwapInfo from './SwapInfo';
import SwapInput from './SwapInput';

const schema = z.object({
  editedToken: z.string(),
  tokenA: z.string().refine((v) => v !== '0x', 'Required'),
  tokenB: z.string().refine((v) => v !== '0x', 'Required'),
  tokenAAmount: z
    .string()
    .transform((v) => new BigNumber(v))
    .refine((v) => v.gt(0), 'Required'),
  tokenBAmount: z
    .string()
    .transform((v) => new BigNumber(v))
    .refine((v) => v.gt(0), 'Required'),
});

type SchemaType = z.infer<typeof schema>;

export default function Swapper() {
  const { active, error } = useWeb3React();
  // It is connected even if wallet not on valid chain id.
  const isConnected = active || error instanceof UnsupportedChainIdError;

  const form = useForm({
    defaultValues: {
      editedToken: '',
      tokenAAmount: '',
      tokenA: '0x',
      tokenBAmount: '',
      tokenB: '0x',
    },
    resolver: zodResolver(schema),
  });

  const { handleSubmit, getValues, setValue } = form;
  const onSwitchInput = useCallback(() => {
    const fields = getValues();
    setValue('tokenAAmount', fields.tokenBAmount);
    setValue('tokenA', fields.tokenB);
    setValue('tokenBAmount', fields.tokenAAmount);
    setValue('tokenB', fields.tokenA);
  }, [getValues, setValue]);

  const tokenA = useWatch({ control: form.control, name: 'tokenA' });
  const tokenB = useWatch({ control: form.control, name: 'tokenB' });
  const token0 = useMemo(
    () => (tokenA !== '0x' ? tokenA : undefined),
    [tokenA]
  );
  const token1 = useMemo(
    () => (tokenB !== '0x' ? tokenB : undefined),
    [tokenB]
  );

  const tokenAAmount = useWatch({
    control: form.control,
    name: 'tokenAAmount',
  });
  const tokenBAmount = useWatch({
    control: form.control,
    name: 'tokenBAmount',
  });
  const editedToken = useWatch({ control: form.control, name: 'editedToken' });

  const tokenABaseUnit = useMemo(
    () =>
      token0 && tokenAAmount
        ? convertAmountToBaseUnit(tokenAAmount, token0)
        : undefined,
    [token0, tokenAAmount]
  );
  const tokenBBaseUnit = useMemo(
    () =>
      token1 && tokenBAmount
        ? convertAmountToBaseUnit(tokenBAmount, token1)
        : undefined,
    [token1, tokenBAmount]
  );

  const swapDirection = editedToken === token0 ? 'out' : 'in';
  const { data: path } = useBestSwapAmount(
    token0,
    token1,
    editedToken === token0 ? tokenABaseUnit : tokenBBaseUnit,
    swapDirection
  );

  // Whenever the input or the swap amount changes update the non-edited field.
  useEffect(() => {
    if (!path) {
      setValue(editedToken === token0 ? 'tokenBAmount' : 'tokenAAmount', '');
      return;
    }

    const first = path[0];
    const last = path[path.length - 1];

    if (editedToken === token0) {
      setValue('tokenBAmount', last.toPlainString());
      return;
    }

    if (editedToken === token1) {
      setValue('tokenAAmount', first.toPlainString());
    }
  }, [editedToken, path, setValue, token0, token1, tokenA, tokenB]);

  const onSubmit = useCallback((state: any) => {
    const { editedToken, tokenA, tokenB, tokenAAmount, tokenBAmount } =
      state as SchemaType;
  }, []);

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
        <Stack component="form" mt={3} onSubmit={handleSubmit(onSubmit)}>
          <SwapInput isTokenA />
          <Stack alignItems="center" my={1}>
            <IconButton sx={{ bgcolor: 'grey.200' }} onClick={onSwitchInput}>
              <MdSwapVert />
            </IconButton>
          </Stack>
          <SwapInput isTokenA={false} />

          {path && <SwapInfo path={path} swapDirection={swapDirection} />}

          <Box mt={3}>
            {isConnected ? (
              <Button type="submit" variant="contained" fullWidth size="large">
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
