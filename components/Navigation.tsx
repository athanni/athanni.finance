import {
  AppBar,
  Avatar,
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Stack,
  Toolbar,
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ConnectWallet from './ConnectWallet';

export default function Navigation() {
  const { pathname } = useRouter();

  return (
    <AppBar color="transparent" position="sticky" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box flex={1}>
          <IconButton>
            <Avatar>A</Avatar>
          </IconButton>
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

        <Stack alignItems="flex-end" flex={1}>
          <ConnectWallet />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
