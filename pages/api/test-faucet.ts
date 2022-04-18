import { NextApiRequest, NextApiResponse } from 'next';

// These are the various ERC20 tokens.
const supportedTokens = [
  '0x55B8778FdC6eB51E7A7B665E06E122551C434B62',
  '0x85998eb0214dc2364925c39F58Aef84e8E5FEDB8',
  '0xeA5DA40745dBE248f09a243Bc8a7d7A7eBfb7119',
  '0x77AC942F3922a015DD915E622B16D8eED56B4564',
  '0xA5cBD0E199d4AD1631f144ce0F21730294ED50A9',
  '0xd872eb90e5A08BB577C082c99B0144C517D09C75',
  '0xCFB5AaC57812D8068C22eED002D43D3E3dbA301C',
  '0xcB1D4bdB8bB163563d98e402C0698C7BB77F075f',
  '0xD209Fcb572F390C1B3163f535E66ed86704fB973',
  '0xf68287bC75B500a82134683aA691426203AAF5d4',
  '0x38B7bFcDb35Df80dC98Cd04c256B96cB262EA533',
];

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

  const { address, token } = req.query;
  if (
    typeof address !== 'string' ||
    typeof token !== 'string' ||
    !supportedTokens.includes(token)
  ) {
    return res.status(400).json({ status: 400, message: 'Bad Request' });
  }

  // TODO: Mint token and send it to the given address.
  return res.status(200).json({
    status: 200,
    message: 'Ok',
  });
}
