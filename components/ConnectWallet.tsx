import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useBoolean } from 'react-use';
import MetamaskIcon from './MetamaskIcon';

export default function ConnectWallet() {
  const [open, toggleOpen] = useBoolean(false);

  return (
    <>
      <Button variant="contained" onClick={toggleOpen}>
        Connect Wallet
      </Button>

      <Dialog open={open} onClose={toggleOpen} fullWidth maxWidth="xs">
        <DialogTitle>Connect Wallet</DialogTitle>
        <DialogContent>
          <List>
            <ListItem button>
              <ListItemIcon>
                <MetamaskIcon />
              </ListItemIcon>
              <ListItemText>MetaMask</ListItemText>
            </ListItem>
          </List>
        </DialogContent>
      </Dialog>
    </>
  );
}
