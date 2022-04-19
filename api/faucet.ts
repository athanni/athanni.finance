import axios from 'axios';

/**
 * Sends token from the faucet. All these tokens are test tokens on Rinkeby.
 */
export async function sendTokens(address: string, token: string) {
  const response = await axios.post('/api/test-faucet', {
    address,
    token,
  });
  return response.data.hash;
}
