import {
  AppBar,
  Box,
  Button,
  ButtonGroup,
  Stack,
  Toolbar,
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ConnectedChain from './ConnectedChain';
import ConnectWallet from './ConnectWallet';
import Logo from './Logo';

export default function Navigation() {
  const { pathname } = useRouter();

  return (
    <AppBar color="transparent" position="sticky" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box flex={1}>
          <Logo />
        </Box>

        <Stack flex={1} alignItems="center">
          <ButtonGroup variant="contained">
            <Link href="/" passHref>
              <Button
                component="a"
                color={pathname === '/' ? 'secondary' : 'inherit'}
              >
                Swap
              </Button>
            </Link>
            <Link href="/pool" passHref>
              <Button
                component="a"
                color={pathname === '/pool' ? 'secondary' : 'inherit'}
              >
                Pool
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
