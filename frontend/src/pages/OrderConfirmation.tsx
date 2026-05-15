import "../styles/OrderConfirmation.css";

interface OrderConfirmationProps {
  order: {
    id: string;
    items: {
      id: string;
      title: string;
      price: number;
      quantity: number;
    }[];
    total: number;
    address: string;
    payment: string;
    placedAt: string;
    delivery?: {
      provider: "Porter";
      riderName: string;
      riderPhone: string;
      vehicleType: string;
      eta: string;
      fee: number;
      instruction: string;
      note: string;
      orderStatus: string;
      nextDeliveryTime?: string;
    };
  } | null;
  delivery?: {
    provider: "Porter";
    riderName: string;
    riderPhone: string;
    vehicleType: string;
    eta: string;
    fee: number;
    instruction: string;
    note: string;
    orderStatus: string;
    nextDeliveryTime?: string;
  } | null;
  onGoHome: () => void;
}

const OrderConfirmation = ({ order, delivery, onGoHome }: OrderConfirmationProps) => {
  if (!order) {
    return (
      <section className="section" id="order-confirmation">
        <div className="section-header">
          <h2>Order Confirmation</h2>
          <p>No recent order found.</p>
        </div>
        <button className="btn" type="button" onClick={onGoHome}>
          Go Home
        </button>
      </section>
    );
  }

  return (
    <section className="section" id="order-confirmation">
      <div className="section-header">
        <h2>Order Confirmed</h2>
        <p>Your tiffin is being prepared. Chef is working on your food now.</p>
      </div>

      <div className="order-confirmation card">
        <div className="order-confirmation__delivery-banner">
          <strong>Chef is preparing your food</strong>
          <p>Delivery partner will be assigned shortly after the order is ready.</p>
        </div>

        <div className="order-confirmation__header">
          <div>
            <h3>Order ID</h3>
            <p>{order.id}</p>
          </div>
          <div>
            <h3>Placed At</h3>
            <p>{order.placedAt}</p>
          </div>
        </div>

        <div className="order-confirmation__items">
          {order.items.map((item) => (
            <div key={item.id} className="order-confirmation__item">
              <span>{item.title}</span>
              <span>Qty {item.quantity}</span>
              <strong>₹{item.price * item.quantity}</strong>
            </div>
          ))}
        </div>

        <div className="order-confirmation__summary">
          <div>
            <span>Delivery Address</span>
            <p>{order.address}</p>
          </div>
          <div>
            <span>Payment Method</span>
            <p>{order.payment}</p>
          </div>
          <div className="order-confirmation__total">
            <span>Total Paid</span>
            <strong>₹{order.total}</strong>
          </div>
        </div>

        <div className="order-confirmation__porter">
          <div>
            <span className="order-confirmation__eyebrow">Porter Delivery</span>
            <h4>Delivery partner will be assigned shortly</h4>
            <p>
              Delivery partner: {delivery?.provider ?? "Porter"} • ETA {delivery?.eta ?? "25-35 min"}
            </p>
          </div>
          <div className="order-confirmation__porter-meta">
            <span>Instruction: {delivery?.instruction ?? "Leave at gate"}</span>
            <span>Notes: {delivery?.note ?? "Call if delayed"}</span>
          </div>
        </div>

        <div className="order-confirmation__actions">
          <button
            className="btn btn-outline"
            type="button"
            onClick={() => {
              window.location.hash = "#tracking";
            }}
          >
            Track Order
          </button>
          <button className="btn" type="button" onClick={onGoHome}>
            Back to Home
          </button>
        </div>

        <div className="order-confirmation__rating">
          <h4>Rate your experience</h4>
          <div className="rating-buttons">
            <button type="button">⭐ 1</button>
            <button type="button">⭐ 2</button>
            <button type="button">⭐ 3</button>
            <button type="button">⭐ 4</button>
            <button type="button">⭐ 5</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderConfirmation;
