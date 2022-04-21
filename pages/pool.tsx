import { Container, Stack } from '@mui/material';
import FooterNavigation from 'components/FooterNavigation';
import Navigation from 'components/Navigation';
import Pooler from 'components/Pooler';

export default function Pool() {
  return (
    <>
      <Navigation />
      <Container>
        <Stack alignItems="center" mt={6}>
          <Pooler />
        </Stack>
      </Container>
      <FooterNavigation />
    </>
  );
}
