import { useMemo, useState } from "react";
import "../styles/ReferEarn.css";

type ReferralStatus = "Pending" | "Completed";

type ReferralItem = {
  id: string;
  friendName: string;
  dateTime: string;
  status: ReferralStatus;
  reward: number;
  claimed?: boolean;
};

interface ReferEarnProps {
  onClaimReward: (cash: number, gold: number, source: string) => void;
}

const APP_LINK = "https://gharkakhana.app/download";
const REF_CODE = "SUSH123";

const INITIAL_REFERRALS: ReferralItem[] = [
  { id: "ref-1", friendName: "Anjali", dateTime: "24 Mar 2026, 9:15 AM", status: "Completed", reward: 100, claimed: false },
  { id: "ref-2", friendName: "Rohit", dateTime: "23 Mar 2026, 7:40 PM", status: "Pending", reward: 100 },
  { id: "ref-3", friendName: "Sneha", dateTime: "22 Mar 2026, 1:22 PM", status: "Completed", reward: 100, claimed: true },
];

const ReferEarn = ({ onClaimReward }: ReferEarnProps) => {
  const [copied, setCopied] = useState(false);
  const [referrals, setReferrals] = useState(INITIAL_REFERRALS);
  const [notice, setNotice] = useState("");

  const shareText = `Hey! Try this amazing home food app 🍱\nUse my code ${REF_CODE} & get ₹100 OFF\nDownload now: ${APP_LINK}`;

  const totals = useMemo(() => {
    const completed = referrals.filter((r) => r.status === "Completed");
    const earned = completed.reduce((sum, item) => sum + item.reward, 0);
    const pending = referrals.filter((r) => r.status === "Pending").length;
    return { earned, pending, completedCount: completed.length };
  }, [referrals]);

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    window.location.hash = "#profile";
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(REF_CODE);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    }
  };

  const handleShare = async (channel: "whatsapp" | "instagram" | "copy") => {
    if (channel === "copy") {
      try {
        await navigator.clipboard.writeText(shareText);
        setNotice("Referral link copied!");
      } catch {
        setNotice("Referral text copied.");
      }
      window.setTimeout(() => setNotice(""), 1500);
      return;
    }
    if (channel === "whatsapp") {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank");
      return;
    }
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
      } catch {
        // ignore share cancel
      }
    } else {
      setNotice("Share not supported here. Use copy link.");
      window.setTimeout(() => setNotice(""), 1600);
    }
  };

  const handleClaim = (id: string, amount: number) => {
    setReferrals((prev) => prev.map((item) => (item.id === id ? { ...item, claimed: true } : item)));
    onClaimReward(amount, 10, "Referral Reward");
    setNotice(`₹${amount} added to wallet + 10 Gold`);
    window.setTimeout(() => setNotice(""), 1800);
  };

  return (
    <section className="section refer-page">
      <header className="refer-page__topbar">
        <button type="button" className="refer-page__back" onClick={handleBack} aria-label="Go back">
          &lt;
        </button>
        <h1>Refer &amp; Earn 🎁</h1>
      </header>

      <section className="refer-page__banner">
        <h2>Invite friends &amp; earn ₹100</h2>
        <p>Share your code and unlock wallet + Gold rewards.</p>
      </section>

      <section className="refer-page__code-card">
        <small>Your Referral Code</small>
        <strong>{REF_CODE}</strong>
        <div className="refer-page__code-actions">
          <button type="button" onClick={handleCopyCode}>
            📋 {copied ? "Copied" : "Copy Code"}
          </button>
          <button type="button" onClick={() => handleShare("copy")}>📤 Share</button>
        </div>
      </section>

      <section className="refer-page__share">
        <h3>Share Options</h3>
        <div>
          <button type="button" onClick={() => handleShare("whatsapp")}>WhatsApp</button>
          <button type="button" onClick={() => handleShare("instagram")}>Instagram</button>
          <button type="button" onClick={() => handleShare("copy")}>Copy Link</button>
        </div>
      </section>

      <section className="refer-page__rewards">
        <h3>Rewards</h3>
        <p>You earn ₹100 when friend orders</p>
        <p>Friend gets ₹50 OFF</p>
        <p>🔥 Bonus after 5 referrals</p>
        <div className="refer-page__stats">
          <span>Total Earned: ₹{totals.earned}</span>
          <span>Pending: {totals.pending}</span>
        </div>
      </section>

      {referrals.length === 0 ? (
        <section className="refer-page__empty">
          <div className="refer-page__empty-ill" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <h3>No referrals yet 😔</h3>
          <p>Invite friends &amp; start earning!</p>
          <button type="button" onClick={() => handleShare("copy")}>Invite Now</button>
        </section>
      ) : (
        <section className="refer-page__history">
          <h3>Referral History</h3>
          <div className="refer-page__history-list">
            {referrals.map((item) => (
              <article key={item.id} className="refer-page__history-card">
                <div>
                  <strong>{item.friendName}</strong>
                  <small>{item.dateTime}</small>
                </div>
                <div className="refer-page__history-right">
                  <span className={item.status === "Completed" ? "is-completed" : "is-pending"}>
                    {item.status === "Completed" ? "✅ Completed" : "⏳ Pending"}
                  </span>
                  {item.status === "Completed" && !item.claimed && (
                    <button type="button" onClick={() => handleClaim(item.id, item.reward)}>
                      Claim ₹{item.reward}
                    </button>
                  )}
                  {item.status === "Completed" && item.claimed && <small>Reward claimed</small>}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {notice && <div className="refer-page__notice">{notice}</div>}
    </section>
  );
};

export default ReferEarn;

