import axios from 'axios';

/**
 * Brigdes the token that has been locked at Rinkeby to Theta Testnet.
 */
export async function bridgeToTheta(bridgeRequestId: string) {
  const response = await axios.post('/api/bridge-to-theta', {
    bridgeRequestId,
  });
  return response.data.hash;
}

/**
 * Brigdes the token that has been burnt at Theta Testnet to Rinkeby.
 */
export async function bridgeToRinkeby(bridgeRequestId: string) {
  const response = await axios.post('/api/bridge-to-rinkeby', {
    bridgeRequestId,
  });
  return response.data.hash;
}
