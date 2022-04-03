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
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import {
  THETA_MAINNET_CHAIN_ID,
  THETA_TESTNET_CHAIN_ID,
} from 'config/constants';
import { useCallback } from 'react';
import { useBoolean } from 'react-use';
import MetamaskIcon from './MetamaskIcon';

type ConnectWalletProps = {
  buttonProps?: ButtonProps;
};

const injectedWallet = new InjectedConnector({
  supportedChainIds: [THETA_TESTNET_CHAIN_ID, THETA_MAINNET_CHAIN_ID],
});

export default function ConnectWallet({ buttonProps }: ConnectWalletProps) {
  const [open, toggleOpen] = useBoolean(false);
  const { active, activate } = useWeb3React();

  const onConnectMetaMask = useCallback(async () => {
    await activate(injectedWallet);
    toggleOpen();
  }, [activate, toggleOpen]);

  return (
    <>
      <Button variant="contained" {...buttonProps} onClick={toggleOpen}>
        Connect Wallet
      </Button>

      <Dialog
        open={!active && open}
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
