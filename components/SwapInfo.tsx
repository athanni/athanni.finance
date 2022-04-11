import { Paper, Stack, Typography } from '@mui/material';
import { SwapAmount } from 'api/router';
import { tokenMap } from 'config/supportedTokens';
import { Fragment } from 'react';
import { MdKeyboardArrowRight } from 'react-icons/md';

type SwapInfoProps = {
  swap: SwapAmount;
};

export default function SwapInfo({ swap }: SwapInfoProps) {
  const firstAddress = swap.path[0];
  const firstValue = swap.pathAmount[0];
  const lastAddress = swap.path[swap.path.length - 1];
  const lastValue = swap.pathAmount[swap.path.length - 1];

  return (
    <Paper variant="outlined" sx={{ mt: 3, px: 2, py: 1, bgcolor: 'grey.100' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body2">Swap rate</Typography>
        <Typography fontWeight="medium">
          {firstValue.toString()} {tokenMap[firstAddress].ticker} ={' '}
          {lastValue.toString()} {tokenMap[lastAddress].ticker}
        </Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body2">Router</Typography>
        <Typography fontWeight="medium" display="flex" alignItems="center">
          {swap.path.map((address, index) => (
            <Fragment key={address}>
              {tokenMap[address].ticker}
              {index !== swap.path.length - 1 ? (
                <MdKeyboardArrowRight />
              ) : null}{' '}
            </Fragment>
          ))}
        </Typography>
      </Stack>
    </Paper>
  );
}
