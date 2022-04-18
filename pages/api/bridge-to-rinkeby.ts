import childPortalAbi from 'abi/ChildPortal.json';
import rootPortalAbi from 'abi/RootPortal.json';
import { RINKEBY_CHAIN_RPC_URL, THETA_TESTNET_RPC_URL } from 'config/constants';
import { ethers } from 'ethers';
import { NextApiRequest, NextApiResponse } from 'next';

// The private key that is the owner of the bridge. This environment is only
// accessible in the backend.
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CHILD_PORTAL_ADDRESS = process.env.CHILD_PORTAL_ADDRESS;
const ROOT_PORTAL_ADDRESS = process.env.ROOT_PORTAL_ADDRESS;

/**
 * Sends tokens from Theta tesnet to Rinkeby for a given token to the receiving address.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!PRIVATE_KEY || !CHILD_PORTAL_ADDRESS || !ROOT_PORTAL_ADDRESS) {
    return res
      .status(500)
      .json({ status: 500, message: 'Internal Server Error' });
  }

  if (req.method !== 'POST') {
    return res.status(404).json({ status: 404, message: 'Not Found' });
  }

  const { bridgeRequestId } = req.body ?? {};
  if (!bridgeRequestId) {
    return res.status(400).json({ status: 400, message: 'Bad Request' });
  }

  const rinkebyProvider = new ethers.providers.JsonRpcProvider(
    RINKEBY_CHAIN_RPC_URL
  );
  const rinkebySigner = new ethers.Wallet(PRIVATE_KEY, rinkebyProvider);
  const thetaTestnetProvider = new ethers.providers.JsonRpcProvider(
    THETA_TESTNET_RPC_URL
  );
  const thetaTestnetSigner = new ethers.Wallet(
    PRIVATE_KEY,
    thetaTestnetProvider
  );

  const rootPortal = new ethers.Contract(
    ROOT_PORTAL_ADDRESS,
    rootPortalAbi,
    rinkebySigner
  );
  const childPortal = new ethers.Contract(
    CHILD_PORTAL_ADDRESS,
    childPortalAbi,
    thetaTestnetSigner
  );

  try {
    const [tokenAddress, transferredBy, transferredTo, transferredAmount] =
      await Promise.all([
        childPortal.tokenAddress(bridgeRequestId),
        childPortal.transferredBy(bridgeRequestId),
        childPortal.transferredTo(bridgeRequestId),
        childPortal.transferredAmount(bridgeRequestId),
      ]);

    // If there is no such bridge request id and its associated data on Theta Testnet, then
    // the bridge request is invalid.
    if (
      !ethers.utils.isAddress(tokenAddress) ||
      !ethers.utils.isAddress(transferredBy) ||
      !ethers.utils.isAddress(transferredTo) ||
      !ethers.BigNumber.from(transferredAmount).isZero
    ) {
      return res.status(400).json({
        status: 400,
        message: 'Bad Request',
      });
    }

    // Request the root portal to withdraw the same amount of tokens and send it to the
    // recipient address.
    const tx = await rootPortal.withdraw(
      tokenAddress,
      bridgeRequestId,
      transferredBy,
      transferredTo,
      transferredAmount
    );
    await tx.wait();

    return res.status(200).json({
      status: 200,
      message: 'OK',
      hash: tx.hash,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
    });
  }
}