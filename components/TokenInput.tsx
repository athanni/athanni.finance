import {
  Box,
  Button,
  ButtonProps,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import { resolveToken, Token } from 'config/supportedTokens';
import { ReactNode, useMemo } from 'react';
import { MdArrowDropDown } from 'react-icons/md';
import { useBoolean } from 'react-use';

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
        sx={{
          justifyContent: 'space-between',
          pr: 1,
        }}
        {...(ButtonProps ?? {})}
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
              <ListItem
                key={tok.address}
                button
                sx={{ px: 4 }}
                onClick={() => {
                  if (onChange) {
                    onChange(tok.address);
                  }
                  toggleOpen(false);
                }}
              >
                <ListItemAvatar>
                  <Box
                    component="img"
                    src={tok.logoUrl}
                    alt={tok.name}
                    width={38}
                    height={38}
                    borderRadius="100%"
                  />
                </ListItemAvatar>
                <ListItemText>
                  <Typography variant="h6">{tok.ticker}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {tok.name}
                  </Typography>
                </ListItemText>
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </>
  );
}
