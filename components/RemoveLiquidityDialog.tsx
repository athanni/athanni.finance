import { Dialog, DialogTitle } from '@mui/material';
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
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        Remove Liquidity ({token0.ticker}-{token1.ticker})
      </DialogTitle>
    </Dialog>
  );
}
