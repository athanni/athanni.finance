import { createTheme } from '@mui/material';
import { grey, indigo } from '@mui/material/colors';

const fontFamily = 'Inter, "Helvetica", "Arial", sans-serif';

export default createTheme({
  palette: {
    primary: indigo,
    // TODO: The secondary color is lighter than the primary even if same color.
    // IDK why?
    secondary: indigo,
  },
  typography: {
    fontFamily,
    allVariants: { fontFamily },
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiButton: {
      defaultProps: {
        color: 'secondary',
        disableElevation: true,
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiButtonGroup: {
      defaultProps: {
        color: 'secondary',
        disableElevation: true,
        disableRipple: true,
      },
    },
    MuiMenu: {
      defaultProps: {
        elevation: 0,
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'bottom',
        },
        transformOrigin: {
          horizontal: 'right',
          vertical: 'top',
        },
      },
      styleOverrides: {
        paper: {
          border: '1px solid',
          borderColor: grey[300],
        },
      },
    },
  },
});
