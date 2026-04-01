import { useEffect, useMemo, useState } from "react";

const NAV_ITEMS = [
  { id: "trade", label: "Négocier" },
  { id: "explore", label: "Explorer" },
  { id: "pool", label: "Pool" },
  { id: "terms", label: "Termes" },
];

const shortenAddress = (address) => `${address.slice(0, 6)}...${address.slice(-4)}`;

const MetaMaskIcon = () => (
  <svg viewBox="0 0 212 189" width="18" height="18" aria-hidden>
    <polygon fill="#E2761B" points="106 0 176 129 145 153 106 130 67 153 36 129" />
    <polygon fill="#E4761B" points="36 129 67 153 106 130 106 189" />
    <polygon fill="#D7C1B3" points="145 153 106 130 106 189" />
    <polygon fill="#233447" points="67 153 95 176 106 189 117 176 145 153 106 166" />
  </svg>
);

export default function Navbar({ tab, onTab, brand }) {
  const [account, setAccount] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [hasMetaMask, setHasMetaMask] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const { ethereum } = window;
    if (!ethereum || !ethereum.isMetaMask) {
      setHasMetaMask(false);
      return;
    }

    setHasMetaMask(true);

    ethereum
      .request({ method: "eth_accounts" })
      .then((accounts) => setAccount(accounts?.[0] ?? ""))
      .catch(() => setAccount(""));

    const onAccountsChanged = (accounts) => {
      setAccount(accounts?.[0] ?? "");
    };

    ethereum.on?.("accountsChanged", onAccountsChanged);
    return () => ethereum.removeListener?.("accountsChanged", onAccountsChanged);
  }, []);

  const walletLabel = useMemo(() => {
    if (account) return shortenAddress(account);
    if (isConnecting) return "Connexion...";
    if (!hasMetaMask) return "Installer MetaMask";
    return "Connecter MetaMask";
  }, [account, isConnecting, hasMetaMask]);

  const handleConnect = async () => {
    if (typeof window === "undefined") return;

    const { ethereum } = window;
    if (!ethereum || !ethereum.isMetaMask) {
      window.open("https://metamask.io/download/", "_blank", "noopener,noreferrer");
      return;
    }

    setIsConnecting(true);
    try {
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts?.[0] ?? "");
    } catch {
      // User rejected or provider error.
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <nav className="navbar">
      <button className="brand" onClick={() => onTab("trade")}>
        <span className="brand-mark" />
        {brand}
      </button>

      <div className="nav-center" role="tablist" aria-label="Navigation principale">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={tab === item.id ? "active" : ""}
            onClick={() => onTab(item.id)}
            role="tab"
            aria-selected={tab === item.id}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="topbar-actions">
        <button
          className={`connect wallet-btn ${account ? "connected" : ""}`}
          onClick={handleConnect}
          disabled={isConnecting}
        >
          <span className="wallet-icon">
            <MetaMaskIcon />
          </span>
          {walletLabel}
        </button>
      </div>
    </nav>
  );
}
