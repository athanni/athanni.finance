const config = {
  ROUTER_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_ROUTER_CONTRACT_ADDRESS!,
};

if (!config.ROUTER_CONTRACT_ADDRESS) {
  throw new Error('Environment variables not configured');
}

export default config;
