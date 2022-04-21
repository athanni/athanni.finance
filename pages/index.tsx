import { Container, Stack } from '@mui/material';
import FooterNavigation from 'components/FooterNavigation';
import Navigation from 'components/Navigation';
import Swapper from 'components/Swapper';

export default function Home() {
  return (
    <>
      <Navigation />
      <Container>
        <Stack alignItems="center" mt={6}>
          <Swapper />
        </Stack>
      </Container>
      <FooterNavigation />
    </>
  );
}
