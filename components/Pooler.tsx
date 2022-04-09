import {
  Button,
  CircularProgress,
  List,
  ListItem,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useAllPooledPairs } from 'api/pairs';
import { useMemo } from 'react';
import LiquidityDialog from './LiquidityDialog';

export default function Pooler() {
  const { data: pooledPairs, isLoading } = useAllPooledPairs();
  const activePairs = useMemo(
    () =>
      (pooledPairs ?? []).filter((pair) => pair.currentAccountBalance.gt(0)),
    [pooledPairs]
  );

  return (
    <>
      <Paper
        variant="outlined"
        sx={{
          px: 4,
          py: 3,
          width: '100%',
          maxWidth: 500,
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography fontWeight="medium">Pool</Typography>
          <LiquidityDialog />
        </Stack>

        {isLoading && (
          <Stack alignItems="center" my={8}>
            <CircularProgress />
          </Stack>
        )}

        {!isLoading && activePairs.length === 0 && (
          <Typography textAlign="center" color="textSecondary" mt={12} mb={10}>
            Your active liquidity positions will appear here.
          </Typography>
        )}

        {!isLoading && activePairs.length > 0 && (
          <List>
            {activePairs.map((pair) => (
              <ListItem key={pair.address}>
                {pair.tokenA}-{pair.tokenB}
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </>
  );
}
