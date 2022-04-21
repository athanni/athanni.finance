import { AppBar, Toolbar } from '@mui/material';
import PageNavigation from './PageNavigation';

export default function FooterNavigation() {
  return (
    <AppBar
      color="transparent"
      position="fixed"
      elevation={0}
      sx={{
        bottom: 0,
        left: 0,
        top: 'unset',
        width: '100%',
        display: {
          xs: 'flex',
          md: 'none',
        },
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <PageNavigation size="small" />
      </Toolbar>
    </AppBar>
  );
}
