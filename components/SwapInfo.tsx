import { Paper, Stack, Typography } from '@mui/material';
import { usePriceImpact, useSlippageAmount } from 'api/router';
import { TokenBalance } from 'api/token';
import BigNumber from 'bignumber.js';
import { DEFAULT_SPLIPPAGE_RATE } from 'config/constants';
import { tokenMap } from 'config/supportedTokens';
import { Fragment } from 'react';
import { MdKeyboardArrowRight } from 'react-icons/md';

type SwapInfoProps = {
  path: TokenBalance[];
  swapDirection: 'in' | 'out';
};

export default function SwapInfo({ path, swapDirection }: SwapInfoProps) {
  const first = path[0];
  const last = path[path.length - 1];

  const impact = usePriceImpact(path);
  const [min, max] = useSlippageAmount(first, last);

  const swapRate = last.dividedBy(first.inMajorUnit());
  const minMaxSwapRate = swapDirection === 'in' ? max : min;
  const minMaxSwapRateText = minMaxSwapRate.lt(new BigNumber('0.0001'))
    ? '< 0.0001'
    : minMaxSwapRate.toString();

  return (
    <Paper variant="outlined" sx={{ mt: 3, px: 2, py: 1, bgcolor: 'grey.100' }}>
      <Stack spacing={1}>
        <Stack justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="textSecondary">
            Swap rate
          </Typography>
          <Typography fontWeight="medium">
            1 {tokenMap[first.address].ticker} ={' '}
            {swapRate.lt(new BigNumber('0.0001'))
              ? '< 0.0001'
              : swapRate.toString()}{' '}
            {tokenMap[last.address].ticker}
          </Typography>
        </Stack>
        {impact && (
          <Stack justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="textSecondary">
              Price impact
            </Typography>
            <Typography fontWeight="medium">{impact}</Typography>
          </Stack>
        )}
        <Stack justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="textSecondary">
            {swapDirection === 'in'
              ? `Maximum sent after slippage (${DEFAULT_SPLIPPAGE_RATE * 100}%)`
              : `Minimum received after slippage (${
                  DEFAULT_SPLIPPAGE_RATE * 100
                }%)`}
          </Typography>
          <Typography fontWeight="medium">
            {minMaxSwapRateText}{' '}
            {swapDirection === 'in' ? max.toTicker() : min.toTicker()}
          </Typography>
        </Stack>
        <Stack justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="textSecondary">
            Router
          </Typography>
          <Typography fontWeight="medium" display="flex" alignItems="center">
            {path.map((token, index) => (
              <Fragment key={token.address}>
                {tokenMap[token.address].ticker}
                {index !== path.length - 1 ? <MdKeyboardArrowRight /> : null}
              </Fragment>
            ))}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}
