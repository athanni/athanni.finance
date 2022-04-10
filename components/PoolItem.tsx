import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
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
          <Box>
            <Typography variant="h6">
              {tokenMap[pair.tokenA].ticker}-{tokenMap[pair.tokenB].ticker}
            </Typography>

            <Typography color="textSecondary">
              {pair.currentAccountBalance.toString()} LP
            </Typography>
          </Box>

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
