import { Button, ButtonGroup, Paper, Stack } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';

type BridgerProps = {
  children?: ReactNode;
};

export default function Bridger({ children }: BridgerProps) {
  const { pathname } = useRouter();

  return (
    <Paper
      variant="outlined"
      sx={{
        px: 4,
        py: 3,
        width: '100%',
        maxWidth: 500,
      }}
    >
      <Stack alignItems="center" mb={4}>
        <ButtonGroup variant="contained" color="inherit">
          <Link href="/bridge/deposit" passHref>
            <Button
              component="a"
              color={pathname === '/bridge/deposit' ? 'secondary' : undefined}
              sx={{ width: 120 }}
            >
              Deposit
            </Button>
          </Link>
          <Link href="/bridge/withdraw" passHref>
            <Button
              component="a"
              color={pathname === '/bridge/withdraw' ? 'secondary' : undefined}
              sx={{ width: 120 }}
            >
              Withdraw
            </Button>
          </Link>
        </ButtonGroup>
      </Stack>

      {children}
    </Paper>
  );
}
