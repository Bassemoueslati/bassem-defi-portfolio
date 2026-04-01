import { useState } from "react";
import { motion } from "framer-motion";
import { TOKENS } from "../tokens";
import TokenModal from "./TokenModal";
import "../styles/swap.css";

const ACTIVE_POOLS = [
  { pair: "ETH/USDC", tokenA: "ETH", tokenB: "USDC", fee: "0.05% fee", tvl: "$6.40M" },
  { pair: "ETH/DAI", tokenA: "ETH", tokenB: "DAI", fee: "0.05% fee", tvl: "$5.12M" },
  { pair: "ETH/WBTC", tokenA: "ETH", tokenB: "WBTC", fee: "0.05% fee", tvl: "$79.60M" },
  { pair: "ETH/UNI", tokenA: "ETH", tokenB: "UNI", fee: "0.05% fee", tvl: "$1.65M" },
  { pair: "ETH/LINK", tokenA: "ETH", tokenB: "LINK", fee: "0.05% fee", tvl: "$1.66M" },
  { pair: "USDC/DAI", tokenA: "USDC", tokenB: "DAI", fee: "0.05% fee", tvl: "$16005.80M" },
];

export default function Liquidity() {
  const [tokenA, setTokenA] = useState("ETH");
  const [tokenB, setTokenB] = useState("USDC");
  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");
  const [modal, setModal] = useState(null);

  return (
    <motion.div
      className="swap-card liquidity-card"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="liquidity-title">Add Liquidity</h2>

      <div className="input-box liquidity-input-box">
        <span>Token 1</span>
        <div className="row">
          <input
            type="number"
            placeholder="0"
            value={amountA}
            onChange={(e) => setAmountA(e.target.value)}
          />

          <div className="token-btn liquidity-token-btn" onClick={() => setModal("a")}>
            <span dangerouslySetInnerHTML={{ __html: TOKENS[tokenA].logo }} />
            {tokenA}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"></path></svg>
          </div>
        </div>
      </div>

      <div className="input-box liquidity-input-box">
        <span>Token 2</span>
        <div className="row">
          <input
            type="number"
            placeholder="0"
            value={amountB}
            onChange={(e) => setAmountB(e.target.value)}
          />

          <div className="token-btn liquidity-token-btn" onClick={() => setModal("b")}>
            <span dangerouslySetInnerHTML={{ __html: TOKENS[tokenB].logo }} />
            {tokenB}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"></path></svg>
          </div>
        </div>
      </div>

      <button className="swap-btn liquidity-add-btn" disabled={!amountA || !amountB}>
        Add Liquidity
      </button>

      <div className="liquidity-pools">
        <h3>ACTIVE POOLS</h3>
        {ACTIVE_POOLS.map((pool) => (
          <div key={pool.pair} className="pool-item">
            <div className="pool-left">
              <div className="pool-icons">
                <span
                  className="pool-logo pool-logo-front"
                  dangerouslySetInnerHTML={{ __html: TOKENS[pool.tokenA].logo }}
                />
                <span
                  className="pool-logo pool-logo-back"
                  dangerouslySetInnerHTML={{ __html: TOKENS[pool.tokenB].logo }}
                />
              </div>
              <div>
                <p className="pool-pair">{pool.pair}</p>
                <span className="pool-fee">{pool.fee}</span>
              </div>
            </div>

            <div className="pool-right">
              <p>{pool.tvl}</p>
              <span>TVL</span>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <TokenModal
          close={() => setModal(null)}
          select={(token) => {
            if (modal === "a") setTokenA(token);
            else setTokenB(token);
            setModal(null);
          }}
        />
      )}
    </motion.div>
  );
}
