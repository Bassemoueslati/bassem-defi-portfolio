import { memo, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const COINS = [
  { id: "ape", symbol: "APE", change: "0.69%", x: "16%", y: "40%", color: "#0f766e", size: 104 },
  { id: "eth", symbol: "ETH", change: "1.18%", x: "73%", y: "24%", color: "#0891b2", size: 68 },
  { id: "btc", symbol: "BTC", change: "0.32%", x: "28%", y: "78%", color: "#d97706", size: 86 },
  { id: "uni", symbol: "UNI", change: "0.92%", x: "88%", y: "57%", color: "#06b6d4", size: 74 },
];

function FloatingTokens({ active = true }) {
  const [activeCoin, setActiveCoin] = useState("ape");
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.innerWidth > 900
  );
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth > 900);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="floating-scene" aria-hidden>
      <div className="blur-blob blob-purple" />
      <div className="blur-blob blob-blue" />
      <div className="blur-blob blob-pink" />

      {isDesktop && active && COINS.map((coin, idx) => (
        <div key={coin.id}>
          <motion.button
            className={`floating-coin ${activeCoin === coin.id ? "is-active" : ""}`}
            style={{
              left: coin.x,
              top: coin.y,
              width: `${coin.size}px`,
              height: `${coin.size}px`,
              "--coin-color": coin.color,
            }}
            animate={
              reduceMotion
                ? undefined
                : { y: [0, -8, 0], rotate: [0, 1.5, 0, -1.5, 0] }
            }
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 4 + idx,
              ease: "easeInOut",
            }}
            onClick={() => setActiveCoin(coin.id)}
          >
            <span>{coin.symbol[0]}</span>
          </motion.button>

          <AnimatePresence>
            {activeCoin === coin.id && (
              <motion.div
                className="coin-tooltip"
                style={{ left: coin.x, top: coin.y }}
                initial={{ opacity: 0, y: -8, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.94 }}
              >
                <strong>{coin.symbol}</strong>
                <span>
                  <small>▲</small> {coin.change}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

export default memo(FloatingTokens);
