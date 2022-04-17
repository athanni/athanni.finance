import { Container, Stack } from '@mui/material';
import BridgeDeposit from 'components/BridgeDeposit';
import Bridger from 'components/Bridger';
import Navigation from 'components/Navigation';

export default function Deposit() {
  return (
    <>
      <Navigation />
      <Container>
        <Stack alignItems="center" mt={6}>
          <Bridger>
            <BridgeDeposit />
          </Bridger>
        </Stack>
      </Container>
    </>
  );
}
