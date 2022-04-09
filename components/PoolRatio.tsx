import { Paper, Stack, Typography } from '@mui/material';
import { usePoolPair } from 'api/pairs';
import { tokenMap } from 'config/supportedTokens';

type PoolRatioProps = {
  tokenA: string;
  tokenB: string;
};

export default function PoolRatio({ tokenA, tokenB }: PoolRatioProps) {
  const { data: pair } = usePoolPair(tokenA, tokenB);
  const token0 = tokenMap[tokenA];
  const token1 = tokenMap[tokenB];

  return pair ? (
    <Paper variant="outlined" sx={{ mt: 2, px: 2, py: 1, bgcolor: 'grey.50' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body2">Reserve {token0.ticker}</Typography>
        <Typography fontWeight="medium">{pair.reserveA.toString()}</Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body2">Reserve {token1.ticker}</Typography>
        <Typography fontWeight="medium">{pair.reserveB.toString()}</Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body2">Price</Typography>
        <Typography fontWeight="medium">
          1 {token0.ticker} ={' '}
          {pair.reserveB.tokenRatioWithAsString(pair.reserveA)} {token1.ticker}
        </Typography>
      </Stack>
    </Paper>
  ) : null;
}
