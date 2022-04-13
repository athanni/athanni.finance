import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Slider,
  Stack,
  Typography,
} from '@mui/material';
import { usePoolPair } from 'api/pairs';
import { useRemoveLiquidity } from 'api/router';
import { TokenBalance, useApprovalOfTransfer } from 'api/token';
import BigNumber from 'bignumber.js';
import { DEFAULT_SPLIPPAGE_RATE } from 'config/constants';
import { tokenMap } from 'config/supportedTokens';
import { ethers } from 'ethers';
import { useSnackbar } from 'notistack';
import { useCallback, useMemo } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { calculateSlippageMin } from 'utils/slippage';
import { z } from 'zod';
import LiquidityRemovalInfo from './LiquidityRemovalInfo';

type RemoveLiquidityDialogProps = {
  pair: string;
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
  pair,
  tokenA,
  tokenB,
  open,
  onClose,
}: RemoveLiquidityDialogProps) {
  const token0 = tokenMap[tokenA];
  const token1 = tokenMap[tokenB];

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      amount: 0,
    },
    resolver: zodResolver(schema),
  });

  const { data: poolPair, isLoading: isPoolPairLoading } = usePoolPair(
    tokenA,
    tokenB
  );
  const amount = useWatch({ control, name: 'amount' });
  const {
    poolTokenAmount,
    tokenAAmount,
    tokenBAmount,
    tokenAMinAmount,
    tokenBMinAmount,
  } = useMemo(() => {
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
      poolTokenAmount: ethers.BigNumber.from(
        poolTokenAmount.integerValue().toFixed()
      ),
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

  const queryClient = useQueryClient();
  const approvalOfTransfer = useApprovalOfTransfer();
  const { enqueueSnackbar } = useSnackbar();
  const removeLiquidity = useRemoveLiquidity();
  const onSubmit = useCallback(
    async (state: SchemaType) => {
      if (!poolTokenAmount || !tokenAMinAmount || !tokenBMinAmount) {
        return;
      }

      try {
        const approvalTx = await approvalOfTransfer(
          pair,
          ethers.BigNumber.from(poolTokenAmount.toString())
        );
        await approvalTx?.wait();

        const removeTx = await removeLiquidity({
          tokenA,
          tokenB,
          liquidity: poolTokenAmount.toString(),
          amountAMin: tokenAMinAmount.balance.toString(),
          amountBMin: tokenBMinAmount.balance.toString(),
        });
        await removeTx?.wait();

        // Refetch all the liquidity pairs.
        queryClient.invalidateQueries('all-pairs');
        queryClient.invalidateQueries('all-pooled-pairs');

        enqueueSnackbar('Successfully withdrew liquidity.', {
          variant: 'success',
        });
        onClose();
      } catch (err) {
        enqueueSnackbar('Failed to withdraw liquidity.', {
          variant: 'error',
        });
        throw err;
      }
    },
    [
      approvalOfTransfer,
      enqueueSnackbar,
      onClose,
      pair,
      poolTokenAmount,
      queryClient,
      removeLiquidity,
      tokenA,
      tokenAMinAmount,
      tokenB,
      tokenBMinAmount,
    ]
  );

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
            <LiquidityRemovalInfo
              tokenA={token0}
              tokenB={token1}
              tokenAAmount={tokenAAmount!}
              tokenBAmount={tokenBAmount!}
              tokenAMinAmount={tokenAMinAmount!}
              tokenBMinAmount={tokenBMinAmount!}
            />
          )}

          <LoadingButton
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            loading={isSubmitting}
            disabled={isPoolPairLoading}
          >
            Remove Liquidity
          </LoadingButton>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
