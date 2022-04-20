import atnt20Abi from 'abi/ATNT20.json';
import { RINKEBY_CHAIN_RPC_URL } from 'config/constants';
import { rinkebyTokens } from 'config/supportedTokens';
import { ethers } from 'ethers';
import { NextApiRequest, NextApiResponse } from 'next';
import { isValidAddress } from 'utils/address';

// These are the various ERC20 tokens that the faucet supports. These
// are dummy tokens counterparts of WETH, USDT, WBTC, etc on Rinkeby.
const supportedTokens = rinkebyTokens.map((it) => it.address);

// The private key that is the owner of the faucet. This environment is only
// accessible in the backend.
const PRIVATE_KEY = process.env.PRIVATE_KEY!;
if (!PRIVATE_KEY) {
  throw new Error('PRIVATE_KEY not provided');
}

/**
 * Sends tokens on Rinkeby for a given token to the receiving address.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(404).json({ status: 404, message: 'Not Found' });
  }

  const { address, token } = req.body ?? {};
  if (
    typeof address !== 'string' ||
    typeof token !== 'string' ||
    !supportedTokens.includes(token) ||
    !isValidAddress(address)
  ) {
    return res.status(400).json({ status: 400, message: 'Bad Request' });
  }

  const provider = new ethers.providers.JsonRpcProvider(RINKEBY_CHAIN_RPC_URL);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);
  const contract = new ethers.Contract(token, atnt20Abi, signer);

  // Send 100 [TOKEN] where token is the major unit of the token.
  const minted = await contract.mint(
    address,
    ethers.BigNumber.from(10).pow(20)
  );

  return res.status(200).json({
    status: 200,
    message: 'OK',
    hash: minted.hash,
  });
}
