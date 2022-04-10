import { Paper, Typography } from '@mui/material';
import { PooledPairItem } from 'api/pairs';
import { tokenMap } from 'config/supportedTokens';

type PoolItemProps = {
  pair: PooledPairItem;
};

export default function PoolItem({ pair }: PoolItemProps) {
  return (
    <Paper variant="outlined" sx={{ px: 2, py: 1, bgcolor: 'grey.50' }}>
      <Typography variant="h6">
        {tokenMap[pair.tokenA].ticker}-{tokenMap[pair.tokenB].ticker}
      </Typography>

      <Typography color="textSecondary">
        {pair.currentAccountBalance.toString()} LP
      </Typography>
    </Paper>
  );
}
