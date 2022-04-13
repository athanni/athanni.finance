import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { green, red } from '@mui/material/colors';
import { PooledPairItem } from 'api/pairs';
import { tokenMap } from 'config/supportedTokens';
import { useCallback, useState } from 'react';
import { MdMoreVert } from 'react-icons/md';
import { useBoolean } from 'react-use';
import RemoveLiquidityDialog from './RemoveLiquidityDialog';

type PoolItemProps = {
  pair: PooledPairItem;
};

export default function PoolItem({ pair }: PoolItemProps) {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [removeOpen, toggleRemoveOpen] = useBoolean(false);

  const onOpenRemoveDialog = useCallback(() => {
    toggleRemoveOpen(true);
    setAnchorEl(null);
  }, [toggleRemoveOpen]);

  const tokenA = tokenMap[pair.tokenA];
  const tokenB = tokenMap[pair.tokenB];

  return (
    <>
      <Paper
        variant="outlined"
        sx={{ pl: 2, pr: 1, py: 1, bgcolor: 'grey.50' }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={4}
          >
            <Box position="relative">
              {/* TODO: Use proper logos here. */}
              <Avatar sx={{ bgcolor: green[300] }}>
                {tokenA.ticker.substring(0, 1)}
              </Avatar>
              <Avatar
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 20,
                  bgcolor: red[200],
                }}
              >
                {tokenB.ticker.substring(0, 1)}
              </Avatar>
            </Box>

            <Box>
              <Typography variant="h6">
                {tokenA.ticker}-{tokenB.ticker}
              </Typography>

              <Typography color="textSecondary">
                {pair.currentAccountBalance.toString()} LP
              </Typography>
            </Box>
          </Stack>

          <IconButton onClick={(ev) => setAnchorEl(ev.currentTarget)}>
            <MdMoreVert />
          </IconButton>
        </Stack>
      </Paper>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={onOpenRemoveDialog}>Remove Liquidity</MenuItem>
      </Menu>

      <RemoveLiquidityDialog
        open={removeOpen}
        onClose={toggleRemoveOpen}
        tokenA={pair.tokenA}
        tokenB={pair.tokenB}
        pair={pair.address}
      />
    </>
  );
}
