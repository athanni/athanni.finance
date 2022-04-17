import { Container, Stack } from '@mui/material';
import Bridger from 'components/Bridger';
import Navigation from 'components/Navigation';

export default function Bridge() {
  return (
    <>
      <Navigation />
      <Container>
        <Stack alignItems="center" mt={6}>
          <Bridger />
        </Stack>
      </Container>
    </>
  );
}
