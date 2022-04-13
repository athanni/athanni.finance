import { createTheme } from '@mui/material';
import { indigo } from '@mui/material/colors';

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
  },
});
