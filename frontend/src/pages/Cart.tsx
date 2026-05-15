import CartItem from "../components/CartItem";
import "../styles/Checkout.css";

interface CartProps {
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
  couponApplied: {
    code: string;
    label: string;
    min?: number;
  } | null;
  couponNotApplicable: boolean;
  onCouponChange: (value: string) => void;
  onApplyCoupon: (code: string) => void;
  onClearCoupon: () => void;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
}

const Cart = ({
  items,
  total,
  discount,
  couponCode,
  couponError,
  couponApplied,
  couponNotApplicable,
  onCouponChange,
  onApplyCoupon,
  onClearCoupon,
  onIncrease,
  onDecrease,
  onRemove,
}: CartProps) => {
  return (
    <section className="section" id="cart">
      <div className="section-header">
        <h2>Cart</h2>
        <p>Review your meals and proceed to checkout.</p>
      </div>
      <div className="grid grid-3">
        <div className="card" style={{ padding: "18px", display: "grid", gap: "12px" }}>
          {items.length === 0 && (
            <p className="muted">Your cart is empty. Add a meal to continue.</p>
          )}
          {items.map((item) => (
            <CartItem
              key={item.id}
              title={item.title}
              price={item.price}
              detail="Lunch tiffin"
              quantity={item.quantity}
              onIncrease={() => onIncrease(item.id)}
              onDecrease={() => onDecrease(item.id)}
              onRemove={() => onRemove(item.id)}
            />
          ))}
        </div>
        <div className="card" style={{ padding: "18px", display: "grid", gap: "12px" }}>
          <h3>Apply Coupon</h3>
          <p className="muted">Use promo codes to save on your order.</p>
          <div className="checkout-coupon-input">
            <input
              type="text"
              placeholder="Try SWIGGY10 or TIFFIN50"
              value={couponCode}
              onChange={(event) => onCouponChange(event.target.value)}
              disabled={items.length === 0}
            />
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => onApplyCoupon(couponCode)}
              disabled={items.length === 0}
            >
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
          {couponError && <p className="muted">{couponError}</p>}
        </div>
        <div className="card" style={{ padding: "18px", display: "grid", gap: "12px" }}>
          <h3>Total</h3>
          <h2>₹{Math.max(0, total - discount)}</h2>
          {discount > 0 && <p className="muted">You saved ₹{discount}.</p>}
          <a href="#checkout" className="btn">Proceed to Checkout</a>
        </div>
      </div>
    </section>
  );
};

export default Cart;

