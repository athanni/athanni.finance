import {
  Box,
  Button,
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
import { useMemo } from 'react';
import { useBoolean } from 'react-use';

type TokenInputProps = {
  tokens: Token[];
  value: string;
  onChange?: (value: string) => void;
};

export default function TokenInput({
  tokens,
  value,
  onChange,
}: TokenInputProps) {
  const [open, toggleOpen] = useBoolean(false);
  const token = useMemo(() => (value ? resolveToken(value) : null), [value]);

  return (
    <>
      <Button
        variant="contained"
        color="inherit"
        onClick={toggleOpen}
        disabled={!onChange}
      >
        {token?.ticker ?? 'Token'}
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
                  onChange!(tok.address);
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
