import { Button, ButtonGroup, Stack } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { THETA_TESTNET_CHAIN_ID } from 'config/constants';
import Link from 'next/link';
import { useRouter } from 'next/router';

type PageNavigationProps = {
  size?: 'small' | 'large';
};

export default function PageNavigation({ size }: PageNavigationProps) {
  const { pathname } = useRouter();
  const { chainId } = useWeb3React();
  const width = size === 'small' ? 90 : 120;

  return (
    <Stack flex={1} alignItems="center">
      <ButtonGroup variant="contained" color="inherit">
        <Link href="/" passHref>
          <Button
            component="a"
            color={pathname === '/' ? 'secondary' : 'inherit'}
            sx={{ width }}
            // onClick={onSwitchTheta}
          >
            Swap
          </Button>
        </Link>
        <Link href="/pool" passHref>
          <Button
            component="a"
            color={pathname === '/pool' ? 'secondary' : 'inherit'}
            sx={{ width }}
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
            sx={{ width }}
          >
            Bridge
          </Button>
        </Link>
      </ButtonGroup>
    </Stack>
  );
}
