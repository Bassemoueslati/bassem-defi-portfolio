import { useState } from "react";
import Navbar from "./components/Navbar";
import Swap from "./components/Swap";
import Liquidity from "./components/Liquidity";

const BRAND_NAME = "BassemBlockCrypto";

const EXPLORE_ITEMS = [
  {
    title: "Liquidité profonde",
    description:
      "Échangez des milliers d'actifs avec un routage fluide et une faible glissance sur les pools majeurs.",
  },
  {
    title: "Sécurité par design",
    description:
      "Transactions on-chain transparentes, informations de prix claires et contrôles avant exécution.",
  },
  {
    title: "Expérience rapide",
    description:
      "Interface optimisée avec recherche rapide, flux plus clairs et interactions fluides sur mobile.",
  },
  {
    title: "Sans verrouillage applicatif",
    description:
      "Utilisez votre wallet directement et gardez le contrôle total de vos actifs à tout moment.",
  },
];

const TERMS = [
  {
    title: "Conditions d'exécution",
    description:
      "Les transactions sont exécutées on-chain et peuvent être impactées par la congestion, la volatilité et les frais de gas.",
  },
  {
    title: "Conditions de liquidité",
    description:
      "Fournir de la liquidité peut exposer à une perte impermanente. Vérifiez toujours le niveau de frais et la volatilité de la paire.",
  },
  {
    title: "Avertissement de risque",
    description:
      "Les crypto-actifs sont risqués. N'investissez que ce que vous pouvez perdre et vérifiez les contrats des tokens.",
  },
];

function TradePage({ account, chainId }) {
  return (
    <div className="hero-grid">
      <div className="hero-copy">
        <p className="eyebrow">Échangez. Explorez. Répétez.</p>
        <h1>Échangez partout, à tout moment.</h1>
        <p>
          Achetez, vendez et échangez des cryptos depuis une interface claire. Actions rapides,
          animations fluides, et mise en page flexible sur desktop et mobile.
        </p>
        <div className="feature-row">
          <span>17+ réseaux</span>
          <span>Échanges fluides</span>
          <span>UI flexible</span>
        </div>
      </div>

      <div className="hero-card-wrap">
        <Swap account={account} chainId={chainId} />
        <p className="page-note">
          Achetez et vendez des cryptos sans frais d'application via une interface claire.
        </p>
      </div>
    </div>
  );
}

function ExplorePage() {
  return (
    <div className="page-columns">
      <section>
        <p className="eyebrow">Explorer</p>
        <h1 className="page-title">Termes du marché et descriptions du protocole</h1>
      </section>

      <div className="info-grid">
        {EXPLORE_ITEMS.map((item) => (
          <article key={item.title} className="info-card">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function PoolPage({ account, chainId }) {
  return (
    <div className="hero-grid">
      <div className="hero-copy">
        <p className="eyebrow">Pool</p>
        <h1>Gérez la liquidité avec des cartes de paires en direct</h1>
        <p>
          Ajoutez et suivez votre liquidité avec un panneau compact inspiré des DEX modernes,
          incluant des cartes de pools actives et un sélecteur de token amélioré.
        </p>
      </div>
      <div className="hero-card-wrap">
        <Liquidity account={account} chainId={chainId} />
      </div>
    </div>
  );
}

function TermsPage() {
  return (
    <div className="page-columns">
      <section>
        <p className="eyebrow">Termes</p>
        <h1 className="page-title">Conditions et descriptions</h1>
      </section>

      <div className="terms-list">
        {TERMS.map((term) => (
          <article key={term.title} className="term-card">
            <h3>{term.title}</h3>
            <p>{term.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("trade");
  const [wallet, setWallet] = useState({
    account: "",
    chainId: null,
  });

  return (
    <div className="app-shell">
      <Navbar
        tab={tab}
        onTab={setTab}
        brand={BRAND_NAME}
        account={wallet.account}
        chainId={wallet.chainId}
        onWalletChange={setWallet}
      />

      <main className="page-shell">
        <section key={tab} className="page-view page-enter">
          {tab === "trade" && <TradePage account={wallet.account} chainId={wallet.chainId} />}
          {tab === "explore" && <ExplorePage />}
          {tab === "pool" && <PoolPage account={wallet.account} chainId={wallet.chainId} />}
          {tab === "terms" && <TermsPage />}
        </section>
      </main>
    </div>
  );
}
