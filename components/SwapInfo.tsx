import { Paper, Stack, Typography } from '@mui/material';
import { usePriceImpact, useSlippageAmount } from 'api/router';
import { TokenBalance } from 'api/token';
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

  return (
    <Paper variant="outlined" sx={{ mt: 3, px: 2, py: 1, bgcolor: 'grey.100' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body2">Swap rate</Typography>
        <Typography fontWeight="medium">
          1 {tokenMap[first.address].ticker} ={' '}
          {last.dividedBy(first.inMajorUnit()).toString()}{' '}
          {tokenMap[last.address].ticker}
        </Typography>
      </Stack>
      {impact && (
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body2">Price impact</Typography>
          <Typography fontWeight="medium">{impact}</Typography>
        </Stack>
      )}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body2">
          {swapDirection === 'in'
            ? `Maximum sent after slippage (${DEFAULT_SPLIPPAGE_RATE * 100}%)`
            : `Minimum received after slippage (${
                DEFAULT_SPLIPPAGE_RATE * 100
              }%)`}
        </Typography>
        <Typography fontWeight="medium">
          {swapDirection === 'in' ? max.toString() : min.toString()}{' '}
          {swapDirection === 'in' ? max.toTicker() : min.toTicker()}
        </Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body2">Router</Typography>
        <Typography fontWeight="medium" display="flex" alignItems="center">
          {path.map((token, index) => (
            <Fragment key={token.address}>
              {tokenMap[token.address].ticker}
              {index !== path.length - 1 ? <MdKeyboardArrowRight /> : null}
            </Fragment>
          ))}
        </Typography>
      </Stack>
    </Paper>
  );
}
