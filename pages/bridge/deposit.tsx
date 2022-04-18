import { Alert, Container, Stack, Link } from '@mui/material';
import BridgeDeposit from 'components/BridgeDeposit';
import Bridger from 'components/Bridger';
import Navigation from 'components/Navigation';
import NLink from 'next/link';

export default function Deposit() {
  return (
    <>
      <Navigation />
      <Container>
        <Stack alignItems="center" mt={6}>
          <Bridger>
            <BridgeDeposit />
          </Bridger>
          <Alert
            severity="info"
            sx={{
              mt: 2,
              width: '100%',
              maxWidth: 500,
            }}
          >
            If you do not have any test tokens, you can you{' '}
            <NLink href="/faucet" passHref>
              <Link>this faucet</Link>
            </NLink>
            .
          </Alert>
        </Stack>
      </Container>
    </>
  );
}
