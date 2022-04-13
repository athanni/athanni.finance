import { Paper, Stack, Typography } from '@mui/material';
import { TokenBalance } from 'api/token';
import { Token } from 'config/supportedTokens';

type LiquidityRemovalInfoProps = {
  tokenA: Token;
  tokenB: Token;
  tokenAAmount: TokenBalance;
  tokenBAmount: TokenBalance;
  tokenAMinAmount: TokenBalance;
  tokenBMinAmount: TokenBalance;
};

export default function LiquidityRemovalInfo({
  tokenA,
  tokenB,
  tokenAAmount,
  tokenBAmount,
  tokenAMinAmount,
  tokenBMinAmount,
}: LiquidityRemovalInfoProps) {
  return (
    <Paper variant="outlined" sx={{ px: 2, py: 1, bgcolor: 'grey.100' }}>
      <Stack spacing={1}>
        <Stack alignItems="center" justifyContent="space-between">
          <Typography variant="body2" color="textSecondary">
            {tokenA.ticker} Received
          </Typography>
          <Typography fontWeight="medium">{tokenAAmount.toString()}</Typography>
        </Stack>
        <Stack alignItems="center" justifyContent="space-between">
          <Typography variant="body2" color="textSecondary">
            {tokenB.ticker} Received
          </Typography>
          <Typography fontWeight="medium">{tokenBAmount.toString()}</Typography>
        </Stack>
        <Stack alignItems="center" justifyContent="space-between">
          <Typography variant="body2" color="textSecondary">
            Minimum {tokenA.ticker} Received
          </Typography>
          <Typography fontWeight="medium">
            {tokenAMinAmount.toString()}
          </Typography>
        </Stack>
        <Stack alignItems="center" justifyContent="space-between">
          <Typography variant="body2" color="textSecondary">
            Minimum {tokenB.ticker} Received
          </Typography>
          <Typography fontWeight="medium">
            {tokenBMinAmount.toString()}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}
