import { Paper, Stack, Typography } from '@mui/material';
import { usePooledPair } from 'api/pairs';
import { resolveToken } from 'config/supportedTokens';

type PoolRatioProps = {
  tokenA: string;
  tokenB: string;
};

export default function PoolInfo({ tokenA, tokenB }: PoolRatioProps) {
  const { data: pair } = usePooledPair(tokenA, tokenB);
  const token0 = resolveToken(tokenA)!;
  const token1 = resolveToken(tokenB)!;

  return pair ? (
    <Paper variant="outlined" sx={{ mt: 2, px: 2, py: 1, bgcolor: 'grey.100' }}>
      <Stack spacing={1}>
        <Stack justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="textSecondary">
            Reserve {token0.ticker}
          </Typography>
          <Typography fontWeight="medium">
            {pair.reserveA.toString()}
          </Typography>
        </Stack>
        <Stack justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="textSecondary">
            Reserve {token1.ticker}
          </Typography>
          <Typography fontWeight="medium">
            {pair.reserveB.toString()}
          </Typography>
        </Stack>
        <Stack justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="textSecondary">
            Price
          </Typography>
          <Typography fontWeight="medium">
            1 {token0.ticker} ={' '}
            {pair.reserveB.tokenRatioWithAsString(pair.reserveA)}{' '}
            {token1.ticker}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  ) : null;
}
