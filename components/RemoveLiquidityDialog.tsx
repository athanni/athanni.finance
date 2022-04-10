import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Slider,
  Stack,
  Typography,
} from '@mui/material';
import BigNumber from 'bignumber.js';
import { tokenMap } from 'config/supportedTokens';
import { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';

type RemoveLiquidityDialogProps = {
  tokenA: string;
  tokenB: string;
  open: boolean;
  onClose: () => void;
};

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
  });

  const onSubmit = useCallback(() => {}, []);

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
                  step={0.0001}
                  valueLabelDisplay="auto"
                  value={field.value}
                  onChange={field.onChange}
                  valueLabelFormat={(v) =>
                    `${new BigNumber(v).multipliedBy(100).toFixed()}%`
                  }
                />
              )}
            />
            <Typography>100%</Typography>
          </Stack>
          <Button type="submit" variant="contained" size="large" fullWidth>
            Remove Liquidity
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
