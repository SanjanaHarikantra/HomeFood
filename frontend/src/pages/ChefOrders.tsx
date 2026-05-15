import "../styles/Chef.css";

type ChefOrder = {
  id: string;
  customer: string;
  items: string;
  status: "Pending" | "Accepted" | "Preparing" | "Shipped" | "Out for Delivery" | "Delivered" | "Rejected";
  time: string;
  address: string;
};

type ChefOrdersProps = {
  orders: ChefOrder[];
  onAccept: (orderId: string) => void;
  onReject: (orderId: string) => void;
  onPreparing: (orderId: string) => void;
  onShip: (orderId: string) => void;
  onOutForDelivery: (orderId: string) => void;
  onDelivered: (orderId: string) => void;
};

const statusLabel: Record<ChefOrder["status"], string> = {
  Pending: "New",
  Accepted: "Accepted",
  Preparing: "Preparing",
  Shipped: "Shipped",
  "Out for Delivery": "Out for Delivery",
  Delivered: "Delivered",
  Rejected: "Rejected",
};

const statusTone: Record<ChefOrder["status"], string> = {
  Pending: "is-warm",
  Accepted: "is-live",
  Preparing: "is-ready",
  Shipped: "is-shipped",
  "Out for Delivery": "is-live",
  Delivered: "is-completed",
  Rejected: "is-muted",
};

const ChefOrders = ({ orders, onAccept, onReject, onPreparing, onShip, onOutForDelivery, onDelivered }: ChefOrdersProps) => {
  const liveOrders = orders.filter((order) => order.status !== "Delivered" && order.status !== "Rejected");
  const completedOrders = orders.filter((order) => order.status === "Delivered").length;
  const pendingOrders = orders.filter((order) => order.status === "Pending").length;
  const readyOrders = orders.filter((order) => ["Preparing", "Shipped", "Out for Delivery"].includes(order.status)).length;
  const visibleOrders = [...liveOrders, ...orders.filter((order) => order.status === "Delivered")];

  return (
    <section className="chef-page chef-orders">
      <div className="chef-page__wrap chef-orders__wrap">
        <article className="chef-orders__hero chef-page__hero">
          <p className="chef-page__eyebrow">Orders</p>
          <div className="chef-orders__hero-top">
            <div>
              <h1>Manage live and completed orders</h1>
              <p>
                Accept, prepare, and hand over orders from the chef queue. Stay synced with your kitchen staff in
                real-time.
              </p>
            </div>
            <div className="chef-orders__hero-actions">
              <button type="button" className="chef-orders__icon-button" aria-label="Search orders">
                Search
              </button>
              <button type="button" className="chef-orders__queue-button">
                Open Queue
              </button>
            </div>
          </div>

          <div className="chef-orders__stats" aria-label="Order summary">
            <div>
              <span>Live Orders</span>
              <strong>{liveOrders.length}</strong>
            </div>
            <div>
              <span>Avg. Prep Time</span>
              <strong>14m</strong>
            </div>
            <div>
              <span>Completed Today</span>
              <strong>{completedOrders}</strong>
            </div>
            <div>
              <span>Pending</span>
              <strong>{pendingOrders + readyOrders}</strong>
            </div>
          </div>
        </article>

        <div className="chef-orders__tabs" aria-label="Order filters">
          <button type="button" className="chef-orders__tab is-active">
            All
          </button>
          <button type="button" className="chef-orders__tab">
            Live
          </button>
          <button type="button" className="chef-orders__tab">
            Preparing
          </button>
          <button type="button" className="chef-orders__tab">
            Completed
          </button>
        </div>

        <div className="chef-orders__grid">
          {visibleOrders.map((order, index) => {
            const itemCount = order.items.split(",").filter(Boolean).length;

            return (
              <article
                key={order.id}
                className={`chef-orders__card ${statusTone[order.status]}`}
                style={{ animationDelay: `${index * 90}ms` }}
              >
                <div className="chef-orders__card-head">
                  <div className="chef-orders__badge">OR</div>
                  <div>
                    <strong>{order.id}</strong>
                    <p>{order.customer}</p>
                  </div>
                  <span className={`chef-orders__status ${statusTone[order.status]}`}>
                    {statusLabel[order.status]}
                  </span>
                </div>

                <ul className="chef-orders__items">
                  {order.items.split(",").map((item) => (
                    <li key={item.trim()}>{item.trim()}</li>
                  ))}
                </ul>

                <div className="chef-orders__meta">
                  <span>{order.time}</span>
                  <span>{order.address}</span>
                </div>

                <div className="chef-orders__footer">
                  <strong className="chef-orders__amount">{itemCount} items</strong>
                  <button type="button" className="chef-orders__details">
                    View details
                  </button>
                </div>

                {order.status !== "Delivered" && order.status !== "Rejected" && (
                  <div className="chef-orders__actions">
                    <button type="button" className="chef-orders__action is-accept" onClick={() => onAccept(order.id)}>
                      Accept
                    </button>
                    <button type="button" className="chef-orders__action is-ready" onClick={() => onPreparing(order.id)}>
                      Preparing
                    </button>
                    <button type="button" className="chef-orders__action is-ready" onClick={() => onShip(order.id)}>
                      Shipped
                    </button>
                    <button type="button" className="chef-orders__action is-ready" onClick={() => onOutForDelivery(order.id)}>
                      Out for Delivery
                    </button>
                    <button type="button" className="chef-orders__action is-accept" onClick={() => onDelivered(order.id)}>
                      Delivered
                    </button>
                    <button type="button" className="chef-orders__action is-reject" onClick={() => onReject(order.id)}>
                      Reject
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ChefOrders;
