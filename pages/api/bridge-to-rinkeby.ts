import childPortalAbi from 'abi/ChildPortal.json';
import rootPortalAbi from 'abi/RootPortal.json';
import config from 'config/config';
import { RINKEBY_CHAIN_RPC_URL, THETA_TESTNET_RPC_URL } from 'config/constants';
import { bridgeMap } from 'config/supportedTokens';
import { ethers } from 'ethers';
import { NextApiRequest, NextApiResponse } from 'next';
import { decodeBrigeId } from 'utils/events';

// The private key that is the owner of the bridge. This environment is only
// accessible in the backend.
const PRIVATE_KEY = process.env.PRIVATE_KEY;

/**
 * Sends tokens from Theta tesnet to Rinkeby for a given token to the receiving address.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!PRIVATE_KEY) {
    return res
      .status(500)
      .json({ status: 500, message: 'Internal Server Error' });
  }

  if (req.method !== 'POST') {
    return res.status(404).json({ status: 404, message: 'Not Found' });
  }

  const { transactionHash } = req.body ?? {};
  if (!transactionHash) {
    console.error('No transaction hash provided.');
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
    config.ROOT_PORTAL_ADDRESS,
    rootPortalAbi,
    rinkebySigner
  );
  const childPortal = new ethers.Contract(
    config.CHILD_PORTAL_ADDRESS,
    childPortalAbi,
    thetaTestnetSigner
  );

  try {
    const receipt = await thetaTestnetProvider.getTransactionReceipt(
      transactionHash
    );
    if (!receipt) {
      console.error('An invalid transaction was provided.');
      return res.status(400).json({
        status: 400,
        message: 'Bad Request',
      });
    }

    // Check if the transaction hash is from the correct smart contract.
    if (receipt.to !== config.CHILD_PORTAL_ADDRESS) {
      console.error('A transaction for a different contract was provided.');
      return res.status(400).json({
        status: 400,
        message: 'Bad Request',
      });
    }

    const bridgeId = decodeBrigeId(receipt);
    if (!bridgeId) {
      console.error('Bridge id does not exist in transaction.');
      return res.status(400).json({
        status: 400,
        message: 'Bad Request',
      });
    }

    const [tokenAddress, transferredBy, transferredTo, transferredAmount] =
      await Promise.all([
        childPortal.tokenAddress(bridgeId),
        childPortal.transferredBy(bridgeId),
        childPortal.transferredTo(bridgeId),
        childPortal.transferredAmount(bridgeId),
      ]);

    // If there is no such bridge request id and its associated data on Theta Testnet, then
    // the bridge request is invalid.
    if (
      !ethers.utils.isAddress(tokenAddress) ||
      !ethers.utils.isAddress(transferredBy) ||
      !ethers.utils.isAddress(transferredTo) ||
      !ethers.BigNumber.from(transferredAmount).isZero
    ) {
      console.error('The bridge id was invalid.');
      return res.status(400).json({
        status: 400,
        message: 'Bad Request',
      });
    }

    // Get the address of the token in the other network.
    const bridgeTokenAddress = bridgeMap[tokenAddress];
    if (!bridgeTokenAddress) {
      console.error('Token address not supported to be bridged.');
      return res.status(400).json({
        status: 400,
        message: 'Bad Request',
      });
    }

    // Request the root portal to withdraw the same amount of tokens and send it to the
    // recipient address.
    const tx = await rootPortal.withdraw(
      bridgeTokenAddress,
      bridgeId,
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
