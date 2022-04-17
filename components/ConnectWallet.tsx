import {
  Button,
  ButtonProps,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import config from 'config/config';
import {
  Network,
  POLYGON_TESTNET_CHAIN_ID,
  THETA_TESTNET_CHAIN_ID,
} from 'config/constants';
import { useCallback } from 'react';
import { useBoolean } from 'react-use';
import { metaMask } from 'utils/metamask';
import { shorternAddress } from 'utils/string';
import MetamaskIcon from './MetamaskIcon';

type ConnectWalletProps = {
  buttonProps?: ButtonProps;
};

const desiredChain =
  config.NETWORK === Network.Theta
    ? THETA_TESTNET_CHAIN_ID
    : POLYGON_TESTNET_CHAIN_ID;

export default function ConnectWallet({ buttonProps }: ConnectWalletProps) {
  const [open, toggleOpen] = useBoolean(false);
  const { isActive, account, chainId } = useWeb3React();

  const onConnectMetaMask = useCallback(async () => {
    await metaMask.activate(desiredChain);
    toggleOpen(false);
  }, [toggleOpen]);

  // Check if really unsupported network selected.
  const isUnsupported = chainId !== desiredChain;

  const connectWallet = !account && !isUnsupported && 'Connect Wallet';
  const wrongNetwork = isUnsupported && 'Wrong Network';
  const address = isActive && account && shorternAddress(account);

  return (
    <>
      <Button
        variant="contained"
        color={isUnsupported ? 'error' : 'secondary'}
        {...buttonProps}
        onClick={!isActive ? toggleOpen : undefined}
      >
        {connectWallet || wrongNetwork || address}
      </Button>

      {/* Show the dialog to connect wallet if its not connected. */}
      <Dialog
        open={!isActive && open}
        onClose={toggleOpen}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Connect Wallet</DialogTitle>
        <DialogContent>
          <List>
            <ListItem button onClick={onConnectMetaMask}>
              <ListItemIcon>
                <MetamaskIcon />
              </ListItemIcon>
              <ListItemText>MetaMask</ListItemText>
            </ListItem>
          </List>
        </DialogContent>
      </Dialog>

      {/* Show the dialog to help user connect to a valid network. */}
      <Dialog
        open={isUnsupported && open}
        onClose={toggleOpen}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Wrong Network</DialogTitle>
        <DialogContent>
          <Typography>
            Change the network to Theta Testnet on your MetaMask wallet.
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  );
}
