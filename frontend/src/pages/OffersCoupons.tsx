import { useEffect, useMemo, useState } from "react";
import "../styles/OffersCoupons.css";

type Coupon = {
  code: string;
  label: string;
  type: "percent" | "flat";
  value: number;
  max?: number;
  min?: number;
};

interface OffersCouponsProps {
  coupons: Coupon[];
  cartTotal: number;
  appliedCoupon: { code: string; label: string; min?: number } | null;
  couponCode: string;
  onCouponChange: (value: string) => void;
  onApplyCoupon: (code: string) => void;
  onClearCoupon: () => void;
}

const couponMeta: Record<string, { expiry: string; tag: string }> = {
  SWIGGY10: { expiry: "Expires in 1d 12h", tag: "Best for small orders" },
  TIFFIN50: { expiry: "Expires tonight", tag: "Flat discount" },
  FRESH15: { expiry: "Expires in 6h 20m", tag: "Limited-time deal" },
  WELCOME25: { expiry: "First order only", tag: "New user offer" },
};

const estimateDiscount = (total: number, coupon: Coupon) => {
  if (coupon.min && total < coupon.min) return 0;
  if (coupon.type === "flat") return Math.min(coupon.value, total);
  const raw = Math.round((total * coupon.value) / 100);
  if (coupon.max) return Math.min(raw, coupon.max);
  return raw;
};

const OffersCoupons = ({
  coupons,
  cartTotal,
  appliedCoupon,
  couponCode,
  onCouponChange,
  onApplyCoupon,
  onClearCoupon,
}: OffersCouponsProps) => {
  const [copied, setCopied] = useState<string>("");
  const [secondsLeft, setSecondsLeft] = useState(3 * 60 * 60 + 17 * 60);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const bestCoupon = useMemo(() => {
    return coupons
      .map((coupon) => ({
        ...coupon,
        savings: estimateDiscount(cartTotal, coupon),
      }))
      .sort((a, b) => b.savings - a.savings)[0];
  }, [cartTotal, coupons]);

  const formatCountdown = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      window.setTimeout(() => setCopied(""), 1400);
    } catch {
      setCopied(code);
      window.setTimeout(() => setCopied(""), 1400);
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    window.location.hash = "#profile";
  };

  return (
    <section className="section offers-page">
      <header className="offers-page__topbar">
        <button type="button" className="offers-page__back" onClick={handleBack} aria-label="Go back">
          &lt;
        </button>
        <h1>Offers &amp; Coupons 🎁</h1>
      </header>

      <section className="offers-page__banner">
        <div>
          <small>Limited Time</small>
          <h2>Flat Rs100 OFF</h2>
          <p>50% OFF up to Rs120 on selected kitchens</p>
        </div>
        <span>{formatCountdown(secondsLeft)}</span>
      </section>

      {coupons.length === 0 ? (
        <section className="offers-page__empty">
          <div className="offers-page__empty-ill" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <h3>No offers available right now</h3>
          <button type="button" onClick={() => (window.location.hash = "#meals")}>
            Explore Food
          </button>
        </section>
      ) : (
        <>
          <section className="offers-page__checkout-box">
            <div className="offers-page__checkout-head">
              <h3>Apply Coupon</h3>
              {bestCoupon && (
                <button type="button" onClick={() => onApplyCoupon(bestCoupon.code)}>
                  ⭐ Auto Apply Best
                </button>
              )}
            </div>
            <div className="offers-page__apply-row">
              <input
                type="text"
                value={couponCode}
                onChange={(event) => onCouponChange(event.target.value)}
                placeholder="Enter coupon manually"
              />
              <button type="button" className="apply" onClick={() => onApplyCoupon(couponCode)}>
                Apply
              </button>
            </div>
            {appliedCoupon && (
              <div className="offers-page__applied">
                Discount applied ✔️ {appliedCoupon.code}
                <button type="button" onClick={onClearCoupon}>Remove</button>
              </div>
            )}
            <small>Cart total: Rs {cartTotal}</small>
          </section>

          <section className="offers-page__list">
            {coupons.map((coupon) => {
              const saved = estimateDiscount(cartTotal, coupon);
              const isBest = bestCoupon?.code === coupon.code;
              const meta = couponMeta[coupon.code];
              return (
                <article key={coupon.code} className={`offers-page__card ${isBest ? "is-best" : ""}`}>
                  <div className="offers-page__card-head">
                    <strong>{coupon.code}</strong>
                    {isBest && <span>Best Offer</span>}
                  </div>
                  <p>{coupon.label}</p>
                  <div className="offers-page__meta">
                    <small>Min order: Rs {coupon.min ?? 0}</small>
                    <small>{meta?.expiry ?? "Limited period"}</small>
                  </div>
                  <div className="offers-page__tag-row">
                    <span>{meta?.tag ?? "Personalized for you"}</span>
                    {saved > 0 && <span>You save Rs {saved}</span>}
                  </div>
                  <div className="offers-page__actions">
                    <button type="button" className="copy" onClick={() => handleCopy(coupon.code)}>
                      {copied === coupon.code ? "Copied" : "Copy Code"}
                    </button>
                    <button type="button" className="apply" onClick={() => onApplyCoupon(coupon.code)}>
                      Apply
                    </button>
                  </div>
                </article>
              );
            })}
          </section>

          <section className="offers-page__types">
            <h3>Offer Types</h3>
            <div>
              <span>₹100 OFF</span>
              <span>50% OFF</span>
              <span>Free Delivery</span>
              <span>Wallet Cashback</span>
            </div>
          </section>
        </>
      )}
    </section>
  );
};

export default OffersCoupons;

