import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  Slider,
  Stack,
  Typography,
} from '@mui/material';
import { usePoolPair } from 'api/pairs';
import { TokenBalance } from 'api/token';
import BigNumber from 'bignumber.js';
import { DEFAULT_SPLIPPAGE_RATE } from 'config/constants';
import { tokenMap } from 'config/supportedTokens';
import { ethers } from 'ethers';
import { useCallback, useMemo } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { calculateSlippageMin } from 'utils/slippage';
import { z } from 'zod';

type RemoveLiquidityDialogProps = {
  tokenA: string;
  tokenB: string;
  open: boolean;
  onClose: () => void;
};

const schema = z.object({
  amount: z.number().gt(0, 'Required'),
});

type SchemaType = z.infer<typeof schema>;

export default function RemoveLiquidityDialog({
  tokenA,
  tokenB,
  open,
  onClose,
}: RemoveLiquidityDialogProps) {
  const token0 = tokenMap[tokenA];
  const token1 = tokenMap[tokenB];

  const { control, handleSubmit } = useForm({
    defaultValues: {
      amount: 0,
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = useCallback((state: SchemaType) => {}, []);

  const { data: poolPair, isLoading: isPoolPairLoading } = usePoolPair(
    tokenA,
    tokenB
  );
  const amount = useWatch({ control, name: 'amount' });
  const { tokenAAmount, tokenBAmount, tokenAMinAmount, tokenBMinAmount } =
    useMemo(() => {
      if (!poolPair) {
        return {};
      }

      const percentage = new BigNumber(amount);
      const poolTokenAmount = percentage.multipliedBy(
        new BigNumber(poolPair.currentAccountBalance.balance.toString())
      );
      const poolPercentage = poolTokenAmount.dividedBy(
        new BigNumber(poolPair.totalSupply.balance.toString())
      );

      const tokenAAmount = poolPercentage.multipliedBy(
        new BigNumber(poolPair.reserveA.balance.toString())
      );
      const tokenBAmount = poolPercentage.multipliedBy(
        new BigNumber(poolPair.reserveB.balance.toString())
      );
      const tokenAMinAmount = calculateSlippageMin(
        tokenAAmount,
        DEFAULT_SPLIPPAGE_RATE
      );
      const tokenBMinAmount = calculateSlippageMin(
        tokenBAmount,
        DEFAULT_SPLIPPAGE_RATE
      );

      return {
        tokenAAmount: new TokenBalance(
          poolPair.tokenA,
          ethers.BigNumber.from(tokenAAmount.integerValue().toFixed())
        ),
        tokenBAmount: new TokenBalance(
          poolPair.tokenB,
          ethers.BigNumber.from(tokenBAmount.integerValue().toFixed())
        ),
        tokenAMinAmount: new TokenBalance(
          poolPair.tokenA,
          ethers.BigNumber.from(tokenAMinAmount.integerValue().toFixed())
        ),
        tokenBMinAmount: new TokenBalance(
          poolPair.tokenB,
          ethers.BigNumber.from(tokenBMinAmount.integerValue().toFixed())
        ),
      };
    }, [amount, poolPair]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>
        Remove Liquidity ({token0.ticker}-{token1.ticker})
      </DialogTitle>
      <DialogContent>
        <Stack component="form" spacing={2} onSubmit={handleSubmit(onSubmit)}>
          <Typography fontWeight="medium">Amount</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography>0%</Typography>
            <Controller
              control={control}
              name="amount"
              render={({ field }) => (
                <Slider
                  min={0}
                  max={1}
                  step={0.001}
                  valueLabelDisplay="auto"
                  value={field.value}
                  onChange={field.onChange}
                  valueLabelFormat={(v) =>
                    `${new BigNumber(v).multipliedBy(100).toFixed(1)}%`
                  }
                />
              )}
            />
            <Typography>100%</Typography>
          </Stack>

          {!isPoolPairLoading && poolPair && (
            <Paper variant="outlined" sx={{ px: 2, py: 1, bgcolor: 'grey.50' }}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="body2">
                  {token0.ticker} Received
                </Typography>
                <Typography fontWeight="medium">
                  {tokenAAmount!.toString()}
                </Typography>
              </Stack>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="body2">
                  {token1.ticker} Received
                </Typography>
                <Typography fontWeight="medium">
                  {tokenBAmount!.toString()}
                </Typography>
              </Stack>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="body2">
                  Minimum {token0.ticker} Received
                </Typography>
                <Typography fontWeight="medium">
                  {tokenAMinAmount!.toString()}
                </Typography>
              </Stack>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="body2">
                  Minimum {token1.ticker} Received
                </Typography>
                <Typography fontWeight="medium">
                  {tokenBMinAmount!.toString()}
                </Typography>
              </Stack>
            </Paper>
          )}

          <Button type="submit" variant="contained" size="large" fullWidth>
            Remove Liquidity
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
