import { useMemo, useState } from "react";
import "../styles/GharKaGold.css";

type GoldHistory = {
  id: string;
  title: string;
  dateTime: string;
  points: number;
  kind: "earned" | "used";
};

type RedeemReward = "discount50" | "freeDelivery" | "cashback";

interface GharKaGoldProps {
  goldPoints: number;
  history: GoldHistory[];
  onRedeem: (reward: RedeemReward) => Promise<{ ok: boolean; message: string }> | { ok: boolean; message: string };
}

const rewards: { id: RedeemReward; title: string; cost: number; subtitle: string }[] = [
  { id: "discount50", title: "Rs50 OFF", cost: 100, subtitle: "Use on your next order" },
  { id: "freeDelivery", title: "Free Delivery", cost: 50, subtitle: "No delivery charge" },
  { id: "cashback", title: "Cashback", cost: 150, subtitle: "Convert to wallet balance" },
];

const getTier = (points: number) => {
  if (points >= 1200) return "Platinum";
  if (points >= 500) return "Gold";
  return "Silver";
};

const GharKaGold = ({ goldPoints, history, onRedeem }: GharKaGoldProps) => {
  const [notice, setNotice] = useState("");
  const tier = getTier(goldPoints);
  const lastEarned = useMemo(
    () => history.filter((tx) => tx.kind === "earned").slice(0, 3),
    [history]
  );

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    window.location.hash = "#profile";
  };

  const handleRedeem = async (reward: RedeemReward) => {
    const result = await onRedeem(reward);
    setNotice(result.message);
    window.setTimeout(() => setNotice(""), 1800);
  };

  return (
    <section className="section gold-page">
      <header className="gold-page__topbar">
        <button type="button" className="gold-page__back" onClick={handleBack} aria-label="Go back">
          &lt;
        </button>
        <h1>Ghar ka Gold</h1>
      </header>

      <section className="gold-page__balance-card">
        <small>Rewards Dashboard</small>
        <h2>🪙 {goldPoints} Points</h2>
        <p>Earn more, save more</p>
      </section>

      <section className="gold-page__earn">
        <h3>How to Earn Gold</h3>
        <div>
          <span>Order Rs100 → Get 10 Gold</span>
          <span>Add Rs500 → Get 20 Gold</span>
          <span>First order bonus 🎁</span>
        </div>
      </section>

      <section className="gold-page__redeem">
        <h3>Redeem Gold</h3>
        <div className="gold-page__redeem-list">
          {rewards.map((reward) => (
            <article key={reward.id}>
              <div>
                <strong>{reward.title}</strong>
                <small>{reward.subtitle}</small>
              </div>
              <div>
                <span>{reward.cost} Gold</span>
                <button type="button" onClick={() => handleRedeem(reward.id)}>
                  Redeem
                </button>
              </div>
            </article>
          ))}
        </div>
        {notice && <div className="gold-page__notice">{notice}</div>}
      </section>

      <section className="gold-page__tiers">
        <h3>Membership Levels</h3>
        <div className="gold-page__tier-list">
          <article className={tier === "Silver" ? "is-active" : ""}>
            <strong>🥉 Silver</strong>
            <small>Starter cashback</small>
          </article>
          <article className={tier === "Gold" ? "is-active" : ""}>
            <strong>🥈 Gold</strong>
            <small>Exclusive offers</small>
          </article>
          <article className={tier === "Platinum" ? "is-active" : ""}>
            <strong>🥇 Platinum</strong>
            <small>Priority delivery</small>
          </article>
        </div>
      </section>

      <section className="gold-page__smart">
        <h3>Smart Features</h3>
        <div>
          <span>🔥 Daily rewards</span>
          <span>🎯 Streak bonuses</span>
          <span>🎁 Festival bonuses</span>
          <span>💎 VIP perks</span>
        </div>
      </section>

      <section className="gold-page__history">
        <h3>Transaction History</h3>
        {history.length === 0 ? (
          <div className="gold-page__empty">
            <h4>No Gold yet 🪙</h4>
            <p>Start ordering to earn rewards!</p>
          </div>
        ) : (
          <div className="gold-page__history-list">
            {history.map((tx) => (
              <article key={tx.id} className="gold-page__tx">
                <div>
                  <strong>{tx.title}</strong>
                  <small>{tx.dateTime}</small>
                </div>
                <span className={tx.kind === "earned" ? "is-earned" : "is-used"}>
                  {tx.kind === "earned" ? "+" : "-"}
                  {Math.abs(tx.points)} Gold
                </span>
              </article>
            ))}
          </div>
        )}
      </section>

      {lastEarned.length > 0 && (
        <section className="gold-page__recent">
          <h3>Recent Earned</h3>
          <div>
            {lastEarned.map((tx) => (
              <span key={tx.id}>{tx.title}</span>
            ))}
          </div>
        </section>
      )}
    </section>
  );
};

export default GharKaGold;
