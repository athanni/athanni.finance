import {
  Box,
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
import { THETA_TESTNET_CHAIN_ID } from 'config/constants';
import { useCallback, useEffect, useMemo } from 'react';
import { MdSwitchRight } from 'react-icons/md';
import { useBoolean } from 'react-use';
import { useCorrectChainId } from 'utils/chain';
import { metaMask } from 'utils/metamask';
import { shorternAddress } from 'utils/string';
import MetamaskIcon from './MetamaskIcon';

type ConnectWalletProps = {
  buttonProps?: ButtonProps;
};

export default function ConnectWallet({ buttonProps }: ConnectWalletProps) {
  const correctChainId = useCorrectChainId();

  const [open, toggleOpen] = useBoolean(false);
  const { isActive, account, chainId, connector } = useWeb3React();
  const isMetaMaskInstalled = useMemo(
    () => Boolean(connector.provider),
    [connector.provider]
  );

  const onInstallMetaMask = useCallback(() => {
    window.open('https://metamask.io/', '_blank', 'noopener noreferrer');
  }, []);

  const onConnectMetaMask = useCallback(async () => {
    await metaMask.activate(correctChainId);
    toggleOpen(false);
  }, [correctChainId, toggleOpen]);

  // Check if really unsupported network selected.
  const isUnsupported = isActive && chainId !== correctChainId;
  useEffect(() => {
    // Whenever the network switches from unsupported to supported, it loses connection.
    // This also causes the metamask to connect on load, if already given permission.
    if (!isUnsupported) {
      metaMask.connectEagerly();
    }
  }, [isUnsupported]);

  const connectWallet = !account && !isUnsupported && 'Connect Wallet';
  const switchNetworkText =
    isUnsupported &&
    `Switch To ${
      correctChainId === THETA_TESTNET_CHAIN_ID ? 'Theta Testnet' : 'Rinkeby'
    }`;
  const switchNetworkShort = 'Switch';
  const address = isActive && account && shorternAddress(account);

  const switchNetwork = useCallback(async () => {
    await metaMask.activate(correctChainId);
  }, [correctChainId]);

  const onOpen = !isActive && toggleOpen;
  const onSwitch = isUnsupported && switchNetwork;
  const onClick = onOpen || onSwitch || undefined;

  return (
    <>
      <Button
        variant="contained"
        color={isUnsupported ? 'warning' : 'secondary'}
        {...buttonProps}
        startIcon={isUnsupported ? <MdSwitchRight /> : null}
        onClick={onClick}
      >
        <Box display={{ xs: 'none', md: 'block' }}>
          {connectWallet || switchNetworkText || address}
        </Box>
        <Box display={{ xs: 'block', md: 'none' }}>
          {connectWallet || switchNetworkShort || address}
        </Box>
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
            <ListItem
              button
              onClick={
                isMetaMaskInstalled ? onConnectMetaMask : onInstallMetaMask
              }
            >
              <ListItemIcon>
                <MetamaskIcon />
              </ListItemIcon>
              <ListItemText>
                {isMetaMaskInstalled ? 'MetaMask' : 'Install MetaMask'}
              </ListItemText>
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
