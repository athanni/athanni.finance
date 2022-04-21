import {
  AppBar,
  Box,
  Button,
  ButtonGroup,
  Stack,
  Toolbar,
} from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { THETA_TESTNET_CHAIN_ID } from 'config/constants';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ConnectedChain from './ConnectedChain';
import ConnectWallet from './ConnectWallet';
import Logo from './Logo';

export default function PageNavigation() {
  const { pathname } = useRouter();
  const { chainId } = useWeb3React();

  return (
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
            chainId === THETA_TESTNET_CHAIN_ID
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
  );
}
