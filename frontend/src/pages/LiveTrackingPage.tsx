import LiveTracking from "../components/LiveTracking";

type DeliverySnapshot = {
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
  timeline: {
    label: string;
    completed: boolean;
    active?: boolean;
  }[];
  trackingId: string;
};

interface LiveTrackingPageProps {
  order?: {
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
  } | null;
  delivery?: DeliverySnapshot | null;
}

const LiveTrackingPage = ({ order, delivery }: LiveTrackingPageProps) => {
  const trackingSteps = ["Placed", "Accepted", "Preparing", "Shipped", "Out for Delivery", "Delivered"];
  const activeLabel =
    delivery?.timeline?.find((step) => step.active)?.label ||
    [...(delivery?.timeline || [])].reverse().find((step) => step.completed)?.label ||
    "Placed";

  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    window.location.hash = "#home";
  };

  return (
    <section className="section" id="tracking">
      <div className="section-header tracking-page__header">
        <div>
          <h2>Live Tracking</h2>
          <p>Track your tiffin in real time.</p>
        </div>
        <div className="tracking-page__actions">
          <button type="button" className="btn btn-outline" onClick={goBack}>
            Back
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              window.location.hash = "#home";
            }}
          >
            Home
          </button>
        </div>
      </div>

      <div className="tracking-page__summary card">
        <div>
          <span className="tracking-page__eyebrow">Porter delivery</span>
          <h3>{order ? order.id : "Live order tracking"}</h3>
          <p>{delivery?.orderStatus ?? "Chef is preparing your food"}</p>
        </div>
        <div className="tracking-page__summary-grid">
          <div>
            <strong>Rider</strong>
            <span>{delivery?.riderName ?? "Assigned shortly"}</span>
          </div>
          <div>
            <strong>Phone</strong>
            <span>{delivery?.riderPhone ?? "Available after assignment"}</span>
          </div>
          <div>
            <strong>Vehicle</strong>
            <span>{delivery?.vehicleType ?? "Bike"}</span>
          </div>
          <div>
            <strong>ETA</strong>
            <span>{delivery?.eta ?? "25-35 min"}</span>
          </div>
        </div>
      </div>

      <div className="tracking-page__chef-update card">
        <p>{delivery?.orderStatus ?? "Chef updated your order: Placed."}</p>
        <strong>Order: {delivery?.trackingId ?? order?.id ?? "Waiting for order"}</strong>
        <div className="tracking-page__status-list">
          {trackingSteps.map((step) => (
            <span key={step} className={step === activeLabel ? "is-active" : ""}>
              {step}
            </span>
          ))}
        </div>
        <div className="tracking-page__rider-card">
          <strong>{delivery?.riderName ?? "Porter Rider"}</strong>
          <span>{delivery?.riderPhone ?? "1800-180-1234"}</span>
          <span>{delivery?.vehicleType ?? "Bike"} • ETA {delivery?.eta ?? "30 min"}</span>
        </div>
      </div>

      <LiveTracking order={order} delivery={delivery} />
    </section>
  );
};

export default LiveTrackingPage;
