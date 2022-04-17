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
import { RINKEBY_CHAIN_ID } from 'config/constants';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo } from 'react';
import { MdSwitchRight } from 'react-icons/md';
import { useBoolean } from 'react-use';
import { metaMask } from 'utils/metamask';
import { shorternAddress } from 'utils/string';
import MetamaskIcon from './MetamaskIcon';

type ConnectWalletProps = {
  buttonProps?: ButtonProps;
};

export default function ConnectWallet({ buttonProps }: ConnectWalletProps) {
  const { pathname } = useRouter();
  // The chain id to connect depends upon which page is open. If the bridge deposit
  // page is open, then it must be connected to Rinkeby else Theta Testnet.
  const correctChainId = useMemo(
    () => (pathname === '/bridge/deposit' ? RINKEBY_CHAIN_ID : config.CHAIN_ID),
    [pathname]
  );

  const [open, toggleOpen] = useBoolean(false);
  const { isActive, account, chainId } = useWeb3React();

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
  const wrongNetwork = isUnsupported && 'Switch Network';
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
