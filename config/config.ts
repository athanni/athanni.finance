import { Network } from './constants';

const config = {
  NETWORK: process.env.NEXT_PUBLIC_NETWORK!,
  ROUTER_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_ROUTER_CONTRACT_ADDRESS!,
};

if (
  !config.ROUTER_CONTRACT_ADDRESS ||
  ![Network.Theta, Network.Polygon].includes(config.NETWORK as any)
) {
  throw new Error('Environment variables not configured');
}

export default config;
