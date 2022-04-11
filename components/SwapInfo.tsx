import { Paper, Stack, Typography } from '@mui/material';
import { usePriceImpact } from 'api/router';
import { TokenBalance } from 'api/token';
import { tokenMap } from 'config/supportedTokens';
import { Fragment } from 'react';
import { MdKeyboardArrowRight } from 'react-icons/md';

type SwapInfoProps = {
  path: TokenBalance[];
};

export default function SwapInfo({ path }: SwapInfoProps) {
  const first = path[0];
  const last = path[path.length - 1];

  const impact = usePriceImpact(path);

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
