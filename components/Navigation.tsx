import {
  AppBar,
  Avatar,
  Button,
  ButtonGroup,
  Container,
  IconButton,
  Toolbar,
} from '@mui/material';
import { FaBitcoin } from 'react-icons/fa';

export default function Navigation() {
  return (
    <AppBar color="transparent" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <IconButton>
          <Avatar>A</Avatar>
        </IconButton>

        <ButtonGroup variant="contained" color="secondary">
          <Button>Swap</Button>
          <Button>Pool</Button>
        </ButtonGroup>

        <Button variant="contained" color="primary">
          Connect Wallet
        </Button>
      </Toolbar>
    </AppBar>
  );
}
