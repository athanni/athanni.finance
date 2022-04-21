import { Container, Stack } from '@mui/material';
import Bridger from 'components/Bridger';
import BridgeWithdraw from 'components/BridgeWithdraw';
import FooterNavigation from 'components/FooterNavigation';
import Navigation from 'components/Navigation';

export default function Deposit() {
  return (
    <>
      <Navigation />
      <Container>
        <Stack alignItems="center" mt={6}>
          <Bridger>
            <BridgeWithdraw />
          </Bridger>
        </Stack>
      </Container>
      <FooterNavigation />
    </>
  );
}
