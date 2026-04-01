import { useState } from "react";
import { motion } from "framer-motion";
import { TOKENS } from "../tokens";
import { getAmountOut, POOLS } from "../utils/amm";
import TokenModal from "./TokenModal";
import "../styles/swap.css";

export default function Swap() {
  const [tokenIn, setTokenIn] = useState("ETH");
  const [tokenOut, setTokenOut] = useState("USDC");
  const [isSwitched, setIsSwitched] = useState(false);
  const [amount, setAmount] = useState("");
  const [modal, setModal] = useState(null);
  const [slippage, setSlippage] = useState(0.5);
  const [showSettings, setShowSettings] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);

  // 🔁 récupérer pool
  const poolKey = `${tokenIn}/${tokenOut}`;
  const reverseKey = `${tokenOut}/${tokenIn}`;

  const pool = POOLS[poolKey] || POOLS[reverseKey];
  const error = pool
    ? ""
    : "Unsupported token pair. Please select a supported pair like ETH/USDC or ETH/DAI.";
  const isDirectPool = !!POOLS[poolKey];

  const amountIn = parseFloat(amount);
  const hasValidAmount = Number.isFinite(amountIn) && amountIn > 0;

  const reserveIn = pool ? (isDirectPool ? pool.reserveIn : pool.reserveOut) : 0;
  const reserveOut = pool ? (isDirectPool ? pool.reserveOut : pool.reserveIn) : 0;

  const outputRaw =
    pool && hasValidAmount ? getAmountOut(amountIn, reserveIn, reserveOut) : 0;
  const output = Number.isFinite(outputRaw) ? outputRaw : 0;

  // ⚡ price impact
  const priceImpact =
    pool && hasValidAmount && reserveIn
      ? ((amountIn / reserveIn) * 100).toFixed(2)
      : "0";

  // 🔁 flip tokens
  const flip = () => {
    setTokenIn(tokenOut);
    setTokenOut(tokenIn);
    setIsSwitched((prev) => !prev);
  }

  // 💱 swap function
  const handleSwap = async () => {
    if (error || !amount || !pool) return;

    setIsSwapping(true);
    // Simulate swap delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSwapping(false);
    setAmount('');
    // In a real app, this would trigger the actual swap transaction
  };

  const MotionDiv = motion.div;
  const MotionButton = motion.button;

  return (
    <MotionDiv
      className="swap-card"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Swap</h2>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="settings-toggle"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
        </button>
      </div>

      {/* SETTINGS */}
      {showSettings && (
        <motion.div
          className="settings"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
        >
          <div className="settings-header">
            <span>Slippage Tolerance</span>
            <span className="slippage-value">{slippage}%</span>
          </div>
          <div className="slippage-options">
            {[0.1, 0.5, 1, 2].map((v) => (
              <button
                key={v}
                onClick={() => setSlippage(v)}
                className={slippage === v ? 'active-slippage' : ''}
              >
                {v}%
              </button>
            ))}
            <div className="custom-slippage">
              <input
                type="number"
                placeholder="Custom"
                onChange={(e) => setSlippage(parseFloat(e.target.value) || 0.5)}
                className="custom-slippage-input"
              />
              <span>%</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* INPUT */}
      <div className="input-box">
        <span>{isSwitched ? "You receive" : "You pay"}</span>

        <div className="row">
          <input
            type="number"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <div className="token-btn" onClick={() => setModal("in")}>
            <span dangerouslySetInnerHTML={{ __html: TOKENS[tokenIn].logo }} />
            {tokenIn}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px' }}><path d="M6 9l6 6 6-6"></path></svg>
          </div>
        </div>
      </div>

      {/* FLIP */}
      <div className="flip-wrapper">
        <div className="flip" onClick={flip}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
        </div>
      </div>

      {/* OUTPUT */}
      <div className="input-box">
        <span>{isSwitched ? "You pay" : "You receive"}</span>

        <div className="row">
          <input
            value={output ? output.toFixed(4) : ""}
            readOnly
          />

          <div className="token-btn" onClick={() => setModal("out")}>
            <span dangerouslySetInnerHTML={{ __html: TOKENS[tokenOut].logo }} />
            {tokenOut}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px' }}><path d="M6 9l6 6 6-6"></path></svg>
          </div>
        </div>
      </div>

      {/* INFO */}
      {(error || amount) && (
        <div className="info">
          {error && <div className="error-message">{error}</div>}

          {amount && !error && (
            <>
              <div className="info-row">
                <span className="info-label">Price Impact</span>
                <span className="info-value" style={{ color: parseFloat(priceImpact) > 5 ? '#ff4d4d' : 'inherit' }}>
                  {priceImpact}%
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Slippage Tolerance</span>
                <span className="info-value">{slippage}%</span>
              </div>
              <div className="info-row">
                <span className="info-label">Minimum Received</span>
                <span className="info-value">
                  {(output * (1 - slippage / 100)).toFixed(4)} {tokenOut}
                </span>
              </div>
            </>
          )}
        </div>
      )}

      {/* BUTTON */}
      <MotionButton
        whileHover={{ scale: isSwapping ? 1 : 1.03 }}
        whileTap={{ scale: isSwapping ? 1 : 0.97 }}
        className="swap-btn"
        disabled={!!error || !amount || !pool || isSwapping}
        onClick={handleSwap}
        style={{
          opacity: (error || !amount || !pool || isSwapping) ? 0.5 : 1,
          cursor: (error || !amount || !pool || isSwapping) ? 'not-allowed' : 'pointer'
        }}
      >
        {isSwapping ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="loading-spinner"></div>
            Swapping...
          </div>
        ) : (
          'Swap'
        )}
      </MotionButton>

      {/* MODAL */}
      {modal && (
        <TokenModal
          close={() => setModal(null)}
          select={(token) => {
            if (modal === "in") setTokenIn(token);
            else setTokenOut(token);
            setModal(null);
          }}
        />
      )}
    </MotionDiv>
  );
}
