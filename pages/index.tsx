import { Container, Stack } from '@mui/material';
import Navigation from 'components/Navigation';
import Swapper from 'components/Swapper';

export default function Home() {
  return (
    <>
      <Navigation />
      <Container>
        <Stack alignItems="center" mt={12}>
          <Swapper />
        </Stack>
      </Container>
    </>
  );
}
