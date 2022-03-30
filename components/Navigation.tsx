import {
  AppBar,
  Avatar,
  Button,
  ButtonGroup,
  IconButton,
  Toolbar,
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navigation() {
  const { pathname } = useRouter();

  return (
    <AppBar color="transparent" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <IconButton>
          <Avatar>A</Avatar>
        </IconButton>

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

        <Button variant="contained">Connect Wallet</Button>
      </Toolbar>
    </AppBar>
  );
}
