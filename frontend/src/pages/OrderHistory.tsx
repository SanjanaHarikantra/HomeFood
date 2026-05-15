import { useMemo, useState } from "react";
import "../styles/OrderHistory.css";
import type { BackendOrder } from "../lib/backend";

type OrderTab = "All" | "Placed" | "Accepted" | "Preparing" | "Shipped" | "Out for Delivery" | "Delivered" | "Rejected";

type OrderHistoryProps = {
  orders: BackendOrder[];
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
    completionTime?: string;
    nextDeliveryTime?: string;
  } | null;
};

const OrderHistory = ({ orders, delivery }: OrderHistoryProps) => {
  const [tab, setTab] = useState<OrderTab>("All");
  const trackingSteps = ["Placed", "Accepted", "Preparing", "Shipped", "Out for Delivery", "Delivered"];

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    window.location.hash = "#profile";
  };

  const visibleOrders = useMemo(() => {
    if (tab === "All") return orders;
    return orders.filter((order) => order.status === tab);
  }, [orders, tab]);

  const latestOrder = orders[0] ?? null;

  return (
    <section className="section order-history-page">
      <header className="order-history-page__topbar">
        <button type="button" className="order-history-page__back" onClick={handleBack} aria-label="Go back">
          &lt;
        </button>
        <h1>My Orders</h1>
      </header>

      <section className="order-history-page__active-card">
        <div className="order-history-page__active-head">
          <div>
            <h2>{latestOrder ? latestOrder.order_code : "No active order"}</h2>
            <p>{latestOrder ? `${latestOrder.subtotal} total` : "Your recent order will appear here"}</p>
          </div>
          <span className="order-history-page__live">{latestOrder ? latestOrder.status : "Idle"}</span>
        </div>

        <div className="order-history-page__porter-card">
          <div>
            <span className="order-history-page__eyebrow">Delivered by Porter</span>
            <h3>{delivery?.riderName ?? "Porter rider assigned"}</h3>
            <p>{delivery?.orderStatus ?? "Chef preparing for pickup"}</p>
          </div>
          <div className="order-history-page__porter-meta">
            <span>Phone: {delivery?.riderPhone ?? "Assigned shortly"}</span>
            <span>Vehicle: {delivery?.vehicleType ?? "Bike"}</span>
            <span>Completion: {delivery?.completionTime ?? "Will update after delivery"}</span>
            <span>ETA: {delivery?.eta ?? "25-35 min"}</span>
          </div>
        </div>

        <div className="order-history-page__active-meta">
          <span>{latestOrder ? new Date(latestOrder.created_at).toLocaleString() : "Waiting for order"}</span>
          <span>Live updates enabled</span>
        </div>

        <div className="order-history-page__tracker" aria-label="Order progress">
          {trackingSteps.map((step, index) => {
            const currentIndex = latestOrder ? Math.max(0, trackingSteps.indexOf(latestOrder.status)) : -1;
            const isDone = Boolean(latestOrder) && index <= currentIndex;
            const isCurrent = Boolean(latestOrder) && step === latestOrder.status;
            return (
              <div
                key={step}
                className={`order-history-page__step ${isDone ? "is-done" : ""} ${isCurrent ? "is-current" : ""}`}
              >
                <span className="order-history-page__dot" />
                <small>{step}</small>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          className="order-history-page__track-btn"
          onClick={() => {
            window.location.hash = "#tracking";
          }}
        >
          Track Order
        </button>
      </section>

      <div className="order-history-page__tabs" role="tablist" aria-label="Order tabs">
        {(["All", "Placed", "Accepted", "Preparing", "Shipped", "Out for Delivery", "Delivered", "Rejected"] as OrderTab[]).map((item) => (
          <button
            key={item}
            type="button"
            className={`order-history-page__tab ${tab === item ? "is-active" : ""}`}
            onClick={() => setTab(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <section className="order-history-page__past-section">
        {visibleOrders.length === 0 ? (
          <div className="order-history-page__empty">
            <div className="order-history-page__empty-illustration" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <h3>No orders yet</h3>
            <p>Looks like there are no orders in this tab. Let us fix that.</p>
            <button
              type="button"
              onClick={() => {
                window.location.hash = "#meals";
              }}
            >
              Browse Food
            </button>
          </div>
        ) : (
          <div className="order-history-page__list">
            {visibleOrders.map((order) => (
              <article key={order.id} className="order-history-page__card">
                <div className="order-history-page__card-head">
                  <h3>{order.order_code}</h3>
                  <span className={order.status === "Delivered" ? "is-delivered" : order.status === "Rejected" ? "is-cancelled" : "is-live"}>
                    {order.status}
                  </span>
                </div>

                <div className="order-history-page__card-meta">
                  <span>{new Date(order.created_at).toLocaleString()}</span>
                  <span>{order.items?.length ?? 0} items</span>
                  <strong>Rs {Number(order.total).toFixed(2)}</strong>
                </div>
                <div className="order-history-page__delivery-history">
                  <span>Delivered by Porter</span>
                  <span>{delivery?.completionTime ?? "Delivery completion time will appear here"}</span>
                  <span>Delivery status history: Placed &rarr; Accepted &rarr; Preparing &rarr; Shipped &rarr; Out for Delivery &rarr; Delivered</span>
                </div>

                <div className="order-history-page__card-actions">
                  <button
                    type="button"
                    className="order-history-page__reorder-btn"
                    onClick={() => {
                      window.location.hash = "#meals";
                    }}
                  >
                    Reorder
                  </button>
                  <button
                    type="button"
                    className="order-history-page__details-btn"
                    onClick={() => {
                      window.location.hash = "#tracking";
                    }}
                  >
                    View Details
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
};

export default OrderHistory;
