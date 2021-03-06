import childPortalAbi from 'abi/ChildPortal.json';
import rootPortalAbi from 'abi/RootPortal.json';
import { getBridgeData } from 'api/bridge';
import config from 'config/config';
import { ethers } from 'ethers';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  ChildPortalContract,
  rinkebyProvider,
  RootPortalContract,
  thetaTestnetProvider,
} from 'utils/ethers';
import { decodeBrigeId } from 'utils/events';
import { partitionOfBridgeId } from 'utils/numeric';

// The private key that is the owner of the bridge. This environment is only
// accessible in the backend.
const PRIVATE_KEY = process.env.PRIVATE_KEY;
if (!PRIVATE_KEY) {
  throw new Error('PRIVATE_KEY not provided');
}

const rinkebySigner = new ethers.Wallet(PRIVATE_KEY, rinkebyProvider);
const thetaTestnetSigner = new ethers.Wallet(PRIVATE_KEY, thetaTestnetProvider);

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

  const { transactionHash } = req.body ?? {};
  if (!transactionHash) {
    console.error('No transaction hash provided.');
    return res.status(400).json({ status: 400, message: 'Bad Request' });
  }

  const rootPortal = new ethers.Contract(
    config.ROOT_PORTAL_ADDRESS,
    rootPortalAbi,
    rinkebySigner
  ) as RootPortalContract;
  const childPortal = new ethers.Contract(
    config.CHILD_PORTAL_ADDRESS,
    childPortalAbi,
    thetaTestnetSigner
  ) as ChildPortalContract;

  try {
    const receipt = await rinkebyProvider.getTransactionReceipt(
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
    if (receipt.to !== config.ROOT_PORTAL_ADDRESS) {
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

    const [bridgeData, childBridgeData] = await Promise.all([
      getBridgeData(rootPortal, bridgeId),
      getBridgeData(childPortal, partitionOfBridgeId(bridgeId)),
    ]);

    if (childBridgeData) {
      console.error('Bridge request has already been submitted.');
      return res.status(400).json({
        status: 400,
        message: 'Bad Request',
      });
    }

    // If there is no such bridge id and its associated data on Rinkeby, then
    // the bridge request is invalid.
    if (!bridgeData) {
      return res.status(400).json({
        status: 400,
        message: 'Bad Request',
      });
    }

    const {
      bridgeTokenAddress,
      transferredBy,
      transferredTo,
      transferredAmount,
    } = bridgeData;

    // Request the child portal to mint the same amount of tokens and send it to the
    // recipient address.
    const tx = await childPortal.send(
      bridgeTokenAddress,
      bridgeId,
      transferredBy,
      transferredTo,
      transferredAmount
    );

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
