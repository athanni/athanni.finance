import { AppBar, Box, Stack, Toolbar } from '@mui/material';
import ConnectedChain from './ConnectedChain';
import ConnectWallet from './ConnectWallet';
import Logo from './Logo';
import PageNavigation from './PageNavigation';

export default function Navigation() {
  return (
    <AppBar color="transparent" position="sticky" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box flex={{ xs: 'auto', md: 1 }}>
          <Logo />
        </Box>

        <Box
          display={{
            xs: 'none',
            md: 'flex',
          }}
        >
          <PageNavigation />
        </Box>

        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          spacing={1}
          flex={{ xs: 'auto', md: 1 }}
        >
          <ConnectedChain />
          <ConnectWallet />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
