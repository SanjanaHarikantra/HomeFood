import { useMemo, useState } from "react";
import "../styles/GharKaWallet.css";

type WalletPaymentMethod = "UPI" | "Card" | "Net Banking";

type WalletTransaction = {
  id: string;
  title: string;
  dateTime: string;
  amount: number;
  status: "Success" | "Pending" | "Failed";
  kind: "credit" | "debit";
};

interface GharKaWalletProps {
  balance: number;
  points: number;
  transactions: WalletTransaction[];
  onAddMoney: (amount: number, method: WalletPaymentMethod) => void;
}

const QUICK_AMOUNTS = [100, 200, 500];

const GharKaWallet = ({ balance, points, transactions, onAddMoney }: GharKaWalletProps) => {
  const [showAddFlow, setShowAddFlow] = useState(false);
  const [amount, setAmount] = useState(500);
  const [method, setMethod] = useState<WalletPaymentMethod>("UPI");
  const [showSuccess, setShowSuccess] = useState(false);

  const spendingThisMonth = useMemo(() => {
    return transactions
      .filter((tx) => tx.kind === "debit")
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
  }, [transactions]);

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    window.location.hash = "#profile";
  };

  const handleAddMoney = () => {
    if (amount <= 0) {
      return;
    }
    onAddMoney(amount, method);
    setShowSuccess(true);
    window.setTimeout(() => {
      setShowSuccess(false);
      setShowAddFlow(false);
    }, 1800);
  };

  return (
    <section className="section wallet-page">
      <header className="wallet-page__topbar">
        <button type="button" className="wallet-page__back" onClick={handleBack} aria-label="Go back">
          &lt;
        </button>
        <h1>Ghar ka Wallet</h1>
      </header>

      <section className="wallet-page__balance-card">
        <p>Ghar ka Wallet</p>
        <h2>Rs {balance.toFixed(2)}</h2>
        <small>Secure wallet for one-click payments</small>
        <div className="wallet-page__actions">
          <button type="button" onClick={() => setShowAddFlow(true)}>+ Add Money</button>
          <button type="button" onClick={() => (window.location.hash = "#checkout")}>Use Wallet</button>
          <button type="button" onClick={() => (window.location.hash = "#gold")}>Rewards</button>
        </div>
      </section>

      {showAddFlow && (
        <section className="wallet-page__add-flow">
          <h3>Add Money</h3>
          <div className="wallet-page__quick-amounts">
            {QUICK_AMOUNTS.map((value) => (
              <button
                key={value}
                type="button"
                className={amount === value ? "is-active" : ""}
                onClick={() => setAmount(value)}
              >
                Rs {value}
              </button>
            ))}
          </div>
          <input
            type="number"
            min={1}
            value={amount}
            onChange={(event) => setAmount(Number(event.target.value))}
            placeholder="Enter amount"
          />
          <div className="wallet-page__methods">
            {(["UPI", "Card", "Net Banking"] as WalletPaymentMethod[]).map((item) => (
              <label key={item}>
                <input
                  type="radio"
                  name="wallet-method"
                  checked={method === item}
                  onChange={() => setMethod(item)}
                />
                {item}
              </label>
            ))}
          </div>
          <button type="button" className="wallet-page__add-btn" onClick={handleAddMoney}>
            Add Money Securely
          </button>
          {showSuccess && <div className="wallet-page__success">Money Added Successfully 🎉</div>}
        </section>
      )}

      <section className="wallet-page__offers">
        <article>
          <strong>Get Rs50 cashback on next order</strong>
          <p>Pay using wallet in checkout to unlock cashback.</p>
        </article>
        <article>
          <strong>Add Rs500 - Get Rs50 bonus</strong>
          <p>Limited period wallet offer.</p>
        </article>
      </section>

      <section className="wallet-page__insights">
        <h3>Smart Insights</h3>
        <div>
          <span>Loyalty Points</span>
          <strong>{points}</strong>
        </div>
        <div>
          <span>Spent (recent)</span>
          <strong>Rs {spendingThisMonth.toFixed(0)}</strong>
        </div>
      </section>

      <section className="wallet-page__history">
        <h3>Transaction History</h3>
        <div className="wallet-page__history-list">
          {transactions.map((tx) => (
            <article key={tx.id} className="wallet-page__tx">
              <div>
                <strong>{tx.title}</strong>
                <p>{tx.dateTime}</p>
              </div>
              <div className="wallet-page__tx-right">
                <span className={tx.kind === "credit" ? "is-credit" : "is-debit"}>
                  {tx.kind === "credit" ? "+" : "-"}Rs {Math.abs(tx.amount).toFixed(2)}
                </span>
                <small>{tx.status}</small>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
};

export default GharKaWallet;


