import {
  AppBar,
  Avatar,
  Button,
  ButtonGroup,
  IconButton,
  Toolbar,
} from '@mui/material';
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
          <Button color={pathname === '/' ? 'secondary' : 'inherit'}>
            Swap
          </Button>
          <Button color={pathname === '/pool' ? 'secondary' : 'inherit'}>
            Pool
          </Button>
        </ButtonGroup>

        <Button variant="contained">Connect Wallet</Button>
      </Toolbar>
    </AppBar>
  );
}
