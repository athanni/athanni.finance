import {
  AppBar,
  Box,
  Button,
  ButtonGroup,
  Stack,
  Toolbar,
} from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import config from 'config/config';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ConnectedChain from './ConnectedChain';
import ConnectWallet from './ConnectWallet';
import Logo from './Logo';

export default function Navigation() {
  const { pathname } = useRouter();
  const { chainId } = useWeb3React();

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
                // onClick={onSwitchTheta}
              >
                Swap
              </Button>
            </Link>
            <Link href="/pool" passHref>
              <Button
                component="a"
                color={pathname === '/pool' ? 'secondary' : 'inherit'}
                sx={{ width: 120 }}
                // onClick={onSwitchTheta}
              >
                Pool
              </Button>
            </Link>
            <Link
              href={
                chainId === config.CHAIN_ID
                  ? '/bridge/withdraw'
                  : '/bridge/deposit'
              }
              passHref
            >
              <Button
                component="a"
                color={pathname.startsWith('/bridge') ? 'secondary' : 'inherit'}
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
