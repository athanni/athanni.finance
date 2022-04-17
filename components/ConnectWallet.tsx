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
  THETA_MAINNET_CHAIN_ID,
  THETA_TESTNET_CHAIN_ID,
} from 'config/constants';
import { useCallback } from 'react';
import { useBoolean } from 'react-use';
import { hooks, metaMask } from 'utils/metamask';
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
  const { isActive, account, error } = useWeb3React();

  const onConnectMetaMask = useCallback(async () => {
    await metaMask.activate(desiredChain);
    toggleOpen(false);
  }, [toggleOpen]);

  // TODO: Check if really unsupported network selected.
  const isUnsupported = Boolean(error);
  // It is connected even if wallet not on valid chain id.
  const isConnected = isActive || isUnsupported;

  return (
    <>
      <Button
        variant="contained"
        color={isUnsupported ? 'error' : 'secondary'}
        {...buttonProps}
        onClick={!isActive ? toggleOpen : undefined}
      >
        {isActive && account && shorternAddress(account)}
        {isUnsupported && 'Wrong Network'}
        {!account && !isUnsupported && 'Connect Wallet'}
      </Button>

      {/* Show the dialog to connect wallet if its not connected. */}
      <Dialog
        open={!isConnected && open}
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
