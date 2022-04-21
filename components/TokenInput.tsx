import {
  Box,
  Button,
  ButtonProps,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { resolveToken, Token } from 'config/supportedTokens';
import { ReactNode, useCallback, useMemo } from 'react';
import { MdAdd, MdArrowDropDown } from 'react-icons/md';
import { useBoolean } from 'react-use';
import { useCorrectChainId } from 'utils/chain';

type TokenInputProps = {
  tokens: Token[];
  value: string;
  disabled?: boolean;
  disableLogo?: boolean;
  onChange?: (value: string) => void;
  ButtonProps?: ButtonProps;
  render?: (value: Token | null) => ReactNode;
};

export default function TokenInput({
  tokens,
  value,
  disabled,
  disableLogo,
  onChange,
  ButtonProps,
  render,
}: TokenInputProps) {
  const [open, toggleOpen] = useBoolean(false);
  const token = useMemo(() => (value ? resolveToken(value) : null), [value]);

  return (
    <>
      <Button
        variant="contained"
        color="inherit"
        onClick={toggleOpen}
        disabled={disabled}
        {...(ButtonProps ?? {})}
        sx={{
          justifyContent: 'space-between',
          pr: 1,
          ...(ButtonProps?.sx ?? {}),
        }}
      >
        {!disableLogo && (
          <>
            {token ? (
              <Box
                component="img"
                src={token.logoUrl}
                alt={token.name}
                width={38}
                height={38}
                borderRadius="100%"
              />
            ) : (
              <Box width={38} height={38} />
            )}
          </>
        )}
        <Box flex={1}>{render ? render(token) : token?.ticker ?? 'Token'}</Box>
        <Box
          component={MdArrowDropDown}
          sx={{ width: 36, height: 24, ml: 0.5 }}
        />
      </Button>

      <Dialog open={open} onClose={toggleOpen} fullWidth maxWidth="xs">
        <DialogTitle>Select a Token</DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <List>
            {tokens.map((tok) => (
              <TokenInputOption
                key={tok.address}
                token={tok}
                onClick={() => {
                  if (onChange) {
                    onChange(tok.address);
                  }
                  toggleOpen(false);
                }}
              />
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </>
  );
}

type TokenInputOptionProps = {
  token: Token;
  onClick?: () => void;
};

function TokenInputOption({ token, onClick }: TokenInputOptionProps) {
  const { connector, chainId } = useWeb3React();
  const correctChainId = useCorrectChainId();

  const isCorrectChain = correctChainId === chainId;

  // Shows the token in the Metamask list.
  const onAddToken = useCallback(async () => {
    if (!connector || !token) {
      return;
    }

    await (connector.provider as any).request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: token.address,
          symbol: token.ticker,
          decimals: token.decimals,
        },
      },
    });
  }, [connector, token]);

  return (
    <ListItem button sx={{ px: 4 }} onClick={onClick}>
      <ListItemAvatar>
        <Box
          component="img"
          src={token.logoUrl}
          alt={token.name}
          width={38}
          height={38}
          borderRadius="100%"
        />
      </ListItemAvatar>
      <ListItemText>
        <Typography variant="h6">{token.ticker}</Typography>
        <Typography variant="body2" color="textSecondary">
          {token.name}
        </Typography>
      </ListItemText>
      {isCorrectChain && (
        <ListItemSecondaryAction>
          <Tooltip title="Add To MetaMask">
            <IconButton size="small" onClick={onAddToken}>
              <MdAdd />
            </IconButton>
          </Tooltip>
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
}
