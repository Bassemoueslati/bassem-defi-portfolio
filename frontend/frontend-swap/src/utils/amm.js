export const getAmountOut = (amountIn, reserveIn, reserveOut) => {
  const amountInWithFee = amountIn * 0.997;
  return (amountInWithFee * reserveOut) / (reserveIn + amountInWithFee);
};

// fake liquidity pools with all pairs
export const POOLS = {
  "ETH/USDC": { reserveIn: 1000, reserveOut: 3200000 },
  "USDC/ETH": { reserveIn: 3200000, reserveOut: 1000 },
  "ETH/DAI": { reserveIn: 800, reserveOut: 2560000 },
  "DAI/ETH": { reserveIn: 2560000, reserveOut: 800 },
  "ETH/WBTC": { reserveIn: 1000, reserveOut: 15 },
  "WBTC/ETH": { reserveIn: 15, reserveOut: 1000 },
  "ETH/UNI": { reserveIn: 1000, reserveOut: 400000 },
  "UNI/ETH": { reserveIn: 400000, reserveOut: 1000 },
  "ETH/LINK": { reserveIn: 1000, reserveOut: 220000 },
  "LINK/ETH": { reserveIn: 220000, reserveOut: 1000 },
  "USDC/DAI": { reserveIn: 1000000, reserveOut: 1000000 },
  "DAI/USDC": { reserveIn: 1000000, reserveOut: 1000000 },
};
