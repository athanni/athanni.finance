import { createTheme } from '@mui/material';
import { indigo } from '@mui/material/colors';

export default createTheme({
  palette: {
    primary: indigo,
    // TODO: The secondary color is lighter than the primary even if same color.
    // IDK why?
    secondary: indigo,
  },
  components: {
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
