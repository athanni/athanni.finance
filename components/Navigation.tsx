import {
  AppBar,
  Box,
  Button,
  ButtonGroup,
  Stack,
  Toolbar,
} from '@mui/material';
import config from 'config/config';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { metaMask } from 'utils/metamask';
import ConnectedChain from './ConnectedChain';
import ConnectWallet from './ConnectWallet';
import Logo from './Logo';

export default function Navigation() {
  const { pathname } = useRouter();

  const onSwitchTheta = useCallback(async () => {
    // Only switch to Theta if it is already connected. Connect eagerly throws
    // if not already connected.
    await metaMask.connectEagerly();
    await metaMask.activate(config.CHAIN_ID);
  }, []);

  return (
    <AppBar color="transparent" position="sticky" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box flex={1}>
          <Logo />
        </Box>

        <Stack flex={1} alignItems="center">
          <ButtonGroup variant="contained" color="inherit">
            <Link href="/" passHref>
              <Button
                component="a"
                color={pathname === '/' ? 'secondary' : 'inherit'}
                sx={{ width: 120 }}
                onClick={onSwitchTheta}
              >
                Swap
              </Button>
            </Link>
            <Link href="/pool" passHref>
              <Button
                component="a"
                color={pathname === '/pool' ? 'secondary' : 'inherit'}
                sx={{ width: 120 }}
                onClick={onSwitchTheta}
              >
                Pool
              </Button>
            </Link>
            <Link href="/bridge" passHref>
              <Button
                component="a"
                color={pathname === '/bridge' ? 'secondary' : 'inherit'}
                sx={{ width: 120 }}
              >
                Bridge
              </Button>
            </Link>
          </ButtonGroup>
        </Stack>

        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          spacing={1}
          flex={1}
        >
          <ConnectedChain />
          <ConnectWallet />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
