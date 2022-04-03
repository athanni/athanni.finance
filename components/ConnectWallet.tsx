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
} from '@mui/material';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import {
  THETA_MAINNET_CHAIN_ID,
  THETA_TESTNET_CHAIN_ID,
} from 'config/constants';
import { useCallback } from 'react';
import { useBoolean } from 'react-use';
import { shorternAddress } from 'utils/string';
import MetamaskIcon from './MetamaskIcon';

type ConnectWalletProps = {
  buttonProps?: ButtonProps;
};

const injectedWallet = new InjectedConnector({
  supportedChainIds: [THETA_TESTNET_CHAIN_ID, THETA_MAINNET_CHAIN_ID],
});

export default function ConnectWallet({ buttonProps }: ConnectWalletProps) {
  const [open, toggleOpen] = useBoolean(false);
  const { active, activate, account, error } = useWeb3React();

  const onConnectMetaMask = useCallback(async () => {
    await activate(injectedWallet);
    toggleOpen(false);
  }, [activate, toggleOpen]);

  const isUnsupported = error instanceof UnsupportedChainIdError;
  // It is connected even if wallet not on valid chain id.
  const isConnected = active || isUnsupported;

  return (
    <>
      <Button
        variant="contained"
        color={isUnsupported ? 'error' : 'secondary'}
        {...buttonProps}
        onClick={() => toggleOpen(true)}
      >
        {active && account && shorternAddress(account)}
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
    </>
  );
}
