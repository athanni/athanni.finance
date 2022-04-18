import axios from 'axios';
import { useCallback } from 'react';

/**
 * Sends token from the faucet. All these tokens are test tokens on Rinkeby.
 */
export function useSendTokens() {
  return useCallback(async (address: string, token: string) => {
    const response = await axios.post('/api/test-faucet', {
      address,
      token,
    });
    return response.data.hash;
  }, []);
}
