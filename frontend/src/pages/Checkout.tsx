import { useState } from "react";
import "../styles/Checkout.css";

interface CheckoutProps {
  items: {
    id: string;
    title: string;
    price: number;
    quantity: number;
  }[];
  total: number;
  discount: number;
  couponCode: string;
  couponError: string;
  coupons: {
    code: string;
    label: string;
    type: "percent" | "flat";
    value: number;
    max?: number;
    min?: number;
  }[];
  couponApplied: {
    code: string;
    label: string;
    min?: number;
  } | null;
  couponNotApplicable: boolean;
  onCouponChange: (value: string) => void;
  onApplyCoupon: (code: string) => void;
  onClearCoupon: () => void;
  addresses: {
    id: string;
    type: "Home" | "Work" | "Other";
    fullAddress: string;
    name: string;
    phone: string;
    city: string;
    pincode: string;
    isDefault?: boolean;
  }[];
  selectedAddressId: string | null;
  onSelectAddress: (id: string) => void;
  walletBalance: number;
  deliveryPartner: string;
  estimatedDeliveryTime: string;
  deliveryFee: number;
  deliveryInstruction: string;
  deliveryNote: string;
  deliveryInstructions: string[];
  deliveryNotes: string[];
  onDeliveryInstructionChange: (value: string) => void;
  onDeliveryNoteChange: (value: string) => void;
  onPlaceOrder: (address: string, payment: string, walletUsed: number) => Promise<void> | void;
  backendError?: string;
}

const Checkout = ({
  items,
  total,
  discount,
  coupons,
  couponCode,
  couponError,
  couponApplied,
  couponNotApplicable,
  onCouponChange,
  onApplyCoupon,
  onClearCoupon,
  addresses,
  selectedAddressId,
  onSelectAddress,
  walletBalance,
  deliveryPartner,
  estimatedDeliveryTime,
  deliveryFee,
  deliveryInstruction,
  deliveryNote,
  deliveryInstructions,
  deliveryNotes,
  onDeliveryInstructionChange,
  onDeliveryNoteChange,
  onPlaceOrder,
  backendError,
}: CheckoutProps) => {
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("UPI");
  const [useWallet, setUseWallet] = useState(false);
  const [error, setError] = useState("");
  const payable = Math.max(0, total - discount);
  const walletUsed = useWallet ? Math.min(walletBalance, payable) : 0;
  const remaining = Math.max(0, payable - walletUsed);
  const selectedAddress = addresses.find((item) => item.id === selectedAddressId) ?? null;
  const selectedAddressText = selectedAddress
    ? `${selectedAddress.fullAddress}, ${selectedAddress.city} - ${selectedAddress.pincode}`
    : "";
  const finalAddress = selectedAddressText || address.trim();

  const estimateDiscount = (code: string) => {
    const coupon = coupons.find((item) => item.code === code);
    if (!coupon) return 0;
    if (coupon.min && payable < coupon.min) return 0;
    if (coupon.type === "flat") return Math.min(coupon.value, payable);
    const raw = Math.round((payable * coupon.value) / 100);
    return coupon.max ? Math.min(raw, coupon.max) : raw;
  };

  const bestCoupon = coupons
    .map((coupon) => ({ ...coupon, save: estimateDiscount(coupon.code) }))
    .sort((a, b) => b.save - a.save)[0];

  const handlePlaceOrder = () => {
    if (items.length === 0) {
      setError("Your cart is empty. Add a meal first.");
      return;
    }
    if (!finalAddress) {
      setError("Please select or enter a delivery address.");
      return;
    }
    if (finalAddress.length < 10) {
      setError("Address should be at least 10 characters.");
      return;
    }
    if (!payment) {
      setError("Please select a payment method.");
      return;
    }
    setError("");
    const paymentLabel =
      walletUsed > 0 && remaining > 0 ? `Wallet + ${payment}` : walletUsed > 0 ? "Wallet" : payment;
    onPlaceOrder(finalAddress, paymentLabel, walletUsed);
  };

  return (
    <section className="checkout-page fade-in" id="checkout">
      <div className="checkout-left">
        <div className="checkout-step active">
          <div className="checkout-step__icon">📍</div>
          <div>
            <h3>Add a delivery address</h3>
            <p>Delivering to your saved location near office.</p>
          </div>
        </div>

        <div className="checkout-address card">
          <h4>Delivery Address</h4>
          <p className="muted">Select saved address or enter manually</p>
          {addresses.length > 0 && (
            <div className="checkout-address-list">
              {addresses.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`checkout-address-item ${selectedAddressId === item.id ? "is-selected" : ""}`}
                  onClick={() => onSelectAddress(item.id)}
                >
                  <strong>{item.type}</strong>
                  <span>{item.fullAddress}, {item.city}</span>
                </button>
              ))}
            </div>
          )}
          <textarea
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder={selectedAddressText || "Enter your full delivery address"}
            rows={4}
          />
          <button type="button" className="btn btn-outline" onClick={() => (window.location.hash = "#addresses")}>
            Manage Addresses
          </button>
        </div>

        <div className="checkout-step">
          <div className="checkout-step__icon">💳</div>
          <div>
            <h3>Payment</h3>
            <p>UPI, cards, and wallet options available.</p>
          </div>
        </div>

        <div className="checkout-address card">
          <label>
            <input
              type="checkbox"
              checked={useWallet}
              onChange={(event) => setUseWallet(event.target.checked)}
            />
            Use Wallet Balance (Rs {walletBalance.toFixed(2)})
          </label>
          {useWallet && (
            <p className="muted">
              Wallet used: Rs {walletUsed.toFixed(2)} {remaining > 0 ? `| Remaining: Rs ${remaining.toFixed(2)}` : "| Fully covered by wallet"}
            </p>
          )}
          <label>
            <input
              type="radio"
              name="payment"
              value="UPI"
              checked={payment === "UPI"}
              onChange={(event) => setPayment(event.target.value)}
            />
            UPI
          </label>
          <label>
            <input
              type="radio"
              name="payment"
              value="Card"
              checked={payment === "Card"}
              onChange={(event) => setPayment(event.target.value)}
            />
            Credit/Debit Card
          </label>
          <label>
            <input
              type="radio"
              name="payment"
              value="Cash"
              checked={payment === "Cash"}
              onChange={(event) => setPayment(event.target.value)}
            />
            Cash on Delivery
          </label>
        </div>

        <div className="checkout-delivery card">
          <div className="checkout-delivery__top">
            <div>
              <span className="checkout-delivery__eyebrow">Delivery Information</span>
              <h4>Delivery Partner: {deliveryPartner}</h4>
            </div>
            <strong>₹{deliveryFee.toFixed(2)}</strong>
          </div>
          <div className="checkout-delivery__grid">
            <div>
              <span>Estimated Delivery Time</span>
              <strong>{estimatedDeliveryTime}</strong>
            </div>
            <div>
              <span>Delivery Fee</span>
              <strong>₹{deliveryFee.toFixed(2)}</strong>
            </div>
          </div>
          <label className="subscription-field">
            Delivery Instructions
            <select
              value={deliveryInstruction}
              onChange={(event) => onDeliveryInstructionChange(event.target.value)}
            >
              {deliveryInstructions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="subscription-field">
            Delivery Notes
            <div className="checkout-delivery__notes">
              {deliveryNotes.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={deliveryNote === item ? "is-selected" : ""}
                  onClick={() => onDeliveryNoteChange(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </label>
        </div>

        <div className="checkout-address card">
          <h4>Apply Coupon</h4>
          {coupons.length > 0 && (
            <div className="checkout-coupon-list">
              {coupons.map((coupon) => (
                <button key={coupon.code} type="button" className="checkout-coupon-chip" onClick={() => onApplyCoupon(coupon.code)}>
                  {coupon.code}
                </button>
              ))}
            </div>
          )}
          {bestCoupon && (
            <button type="button" className="btn btn-outline" onClick={() => onApplyCoupon(bestCoupon.code)}>
              ⭐ Auto Apply Best ({bestCoupon.code})
            </button>
          )}
          <div className="checkout-coupon-input">
            <input
              type="text"
              placeholder="Try SWIGGY10, TIFFIN50, FRESH15"
              value={couponCode}
              onChange={(event) => onCouponChange(event.target.value)}
            />
            <button type="button" className="btn btn-outline" onClick={() => onApplyCoupon(couponCode)}>
              Apply
            </button>
          </div>
          {couponApplied && (
            <div className="muted" style={{ display: "grid", gap: "6px" }}>
              <span>Applied: {couponApplied.code} · {couponApplied.label}</span>
              <button className="btn btn-outline" type="button" onClick={onClearCoupon}>
                Remove Coupon
              </button>
            </div>
          )}
          {couponNotApplicable && (
            <p className="muted">
              Coupon requires a minimum order of ₹{couponApplied?.min}.
            </p>
          )}
          {discount > 0 && <p className="muted">Coupon applied. You saved ₹{discount}.</p>}
          {couponError && <p className="muted">{couponError}</p>}
        </div>

        {error && <p className="muted">{error}</p>}
        {backendError && <p className="muted">{backendError}</p>}
      </div>

      <aside className="checkout-right card">
        <h3>Order Summary</h3>
        {items.length === 0 && <p className="muted">No items in your cart.</p>}
        {items.map((item) => (
          <div className="checkout-item" key={item.id}>
            <div>
              <h5>{item.title}</h5>
              <small>Qty {item.quantity}</small>
            </div>
            <strong>₹{item.price * item.quantity}</strong>
          </div>
        ))}

        <div className="bill">
          <h4>Bill Details</h4>
          <div><span>Item Total</span><strong>₹{total}</strong></div>
          <div><span>Delivery Fee</span><strong>₹{deliveryFee.toFixed(2)}</strong></div>
          {discount > 0 && (
            <div><span>Coupon Discount</span><strong>-₹{discount}</strong></div>
          )}
          {walletUsed > 0 && (
            <div><span>Wallet Used</span><strong>-₹{walletUsed.toFixed(2)}</strong></div>
          )}
          <div className="total">
            <span>Total</span>
            <strong>₹{remaining.toFixed(2)}</strong>
          </div>
        </div>

        <button className="btn checkout-pay" type="button" onClick={handlePlaceOrder}>
          Place Order
        </button>
      </aside>
    </section>
  );
};

export default Checkout;
