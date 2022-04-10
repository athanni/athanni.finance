import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Slider,
  Stack,
  Typography,
} from '@mui/material';
import { tokenMap } from 'config/supportedTokens';

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

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>
        Remove Liquidity ({token0.ticker}-{token1.ticker})
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Typography fontWeight="medium">Amount</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography>0%</Typography>
            <Slider valueLabelDisplay="auto" />
            <Typography>100%</Typography>
          </Stack>
          <Button variant="contained" size="large" fullWidth>
            Remove Liquidity
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
