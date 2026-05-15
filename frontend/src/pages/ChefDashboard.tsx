import "../styles/Chef.css";

type ChefOrder = {
  id: string;
  customer: string;
  items: string;
  status: "Pending" | "Accepted" | "Preparing" | "Shipped" | "Out for Delivery" | "Delivered" | "Rejected";
  time: string;
  address: string;
};

type ChefMenuItem = {
  id: string;
  name: string;
  price: string;
  image: string;
};

type ChefDashboardProps = {
  online: boolean;
  orders: ChefOrder[];
  menuItems: ChefMenuItem[];
  onToggleOnline: () => void;
  onAccept: (orderId: string) => void;
  onReject: (orderId: string) => void;
  onPreparing: (orderId: string) => void;
  onShip: (orderId: string) => void;
  onOutForDelivery: (orderId: string) => void;
  onDelivered: (orderId: string) => void;
  onOpenOrders: () => void;
  onOpenMenu: () => void;
  onOpenProfile: () => void;
  onEditMenuItem: (itemId: string) => void;
  onDeleteMenuItem: (itemId: string) => void;
};

type DashboardStat = {
  label: string;
  value: string;
  note: string;
  icon: string;
  tone: "mint" | "sun" | "amber" | "sky";
};

const ChefDashboard = ({
  online,
  orders,
  menuItems,
  onToggleOnline,
  onAccept,
  onReject,
  onPreparing,
  onShip,
  onOutForDelivery,
  onDelivered,
  onOpenOrders,
  onOpenMenu,
  onOpenProfile,
  onEditMenuItem,
  onDeleteMenuItem,
}: ChefDashboardProps) => {
  const liveOrders = orders.filter((order) => order.status !== "Delivered" && order.status !== "Rejected");
  const completedOrders = orders.filter((order) => order.status === "Delivered").length;
  const pendingOrders = orders.filter((order) => order.status === "Pending").length;
  const acceptedOrders = orders.filter((order) =>
    ["Accepted", "Preparing", "Shipped", "Out for Delivery"].includes(order.status)
  ).length;
  const activeOrder = orders.find((order) => order.status === "Pending") ?? orders[0];
  const menuCount = menuItems.length;

  const stats: DashboardStat[] = [
    { label: "Live Orders", value: String(liveOrders.length), note: "Orders in progress", icon: "🛵", tone: "mint" },
    { label: "Completed", value: String(completedOrders), note: "Delivered today", icon: "✅", tone: "sun" },
    { label: "Earnings", value: "₹18,450", note: "Weekly payout", icon: "💰", tone: "amber" },
    { label: "Rating", value: "4.8★", note: "Customer trust", icon: "⭐", tone: "sky" },
  ];

  return (
    <section className="chef-page chef-dashboard-page">
      <div className="chef-page__wrap chef-dashboard__wrap">
        <article className="chef-page__hero chef-dashboard__hero chef-dashboard__hero--premium">
          <div className="chef-dashboard__hero-glow chef-dashboard__hero-glow--one" />
          <div className="chef-dashboard__hero-glow chef-dashboard__hero-glow--two" />

          <div className="chef-page__eyebrow chef-dashboard__eyebrow">Chef Dashboard</div>
          <div className="chef-dashboard__hero-topline">
            <span className={`chef-dashboard__live-pill ${online ? "is-live" : "is-offline"}`}>
              <span className="chef-dashboard__live-dot" />
              {online ? "Kitchen live" : "Kitchen paused"}
            </span>
            <span className="chef-dashboard__hero-mini">Menu items: {menuCount}</span>
            <span className="chef-dashboard__hero-mini">Active orders: {liveOrders.length}</span>
          </div>

          <h1>Run your kitchen from one place</h1>
          <p>Track orders, manage your menu, and keep your kitchen online for nearby customers.</p>

          <div className="chef-page__hero-actions chef-dashboard__hero-actions">
            <button type="button" className="chef-page__button chef-dashboard__button" onClick={onToggleOnline}>
              {online ? "Online" : "Offline"}
            </button>
            <button type="button" className="chef-page__button chef-page__button--light chef-dashboard__button" onClick={onOpenMenu}>
              Manage Menu
            </button>
          </div>
        </article>

        <div className="chef-page__metrics chef-dashboard__metrics">
          {stats.map((item, index) => (
            <article
              key={item.label}
              className={`chef-page__metric chef-dashboard__metric chef-dashboard__metric--animated chef-dashboard__metric--${item.tone}`}
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <div className="chef-dashboard__metric-top">
                <span className="chef-dashboard__metric-icon" aria-hidden="true">
                  {item.icon}
                </span>
                <small>{item.label}</small>
              </div>
              <strong>{item.value}</strong>
              <span>{item.note}</span>
            </article>
          ))}
        </div>

        <div className="chef-page__grid chef-dashboard__grid">
          <article className="chef-page__card chef-page__card--dark chef-dashboard__card chef-dashboard__card--order">
            <span className="chef-page__status">New Order</span>
            <h3>{activeOrder?.items ?? "No active order"}</h3>
            <p>Customer: {activeOrder?.customer ?? "All caught up"}</p>
            <p>Delivery: {activeOrder?.time ?? "--"}</p>
            <div className="chef-page__hero-actions">
              <button type="button" className="chef-page__button chef-dashboard__button" onClick={() => activeOrder && onAccept(activeOrder.id)}>
                Accept
              </button>
              <button
                type="button"
                className="chef-page__button chef-page__button--light chef-dashboard__button"
                onClick={() => activeOrder && onReject(activeOrder.id)}
              >
                Reject
              </button>
              <button
                type="button"
                className="chef-page__button chef-page__button--light chef-dashboard__button"
                onClick={() => activeOrder && onPreparing(activeOrder.id)}
              >
                Prepare
              </button>
              <button
                type="button"
                className="chef-page__button chef-page__button--light chef-dashboard__button"
                onClick={() => activeOrder && onShip(activeOrder.id)}
              >
                Shipped
              </button>
              <button
                type="button"
                className="chef-page__button chef-page__button--light chef-dashboard__button"
                onClick={() => activeOrder && onOutForDelivery(activeOrder.id)}
              >
                Out for Delivery
              </button>
              <button
                type="button"
                className="chef-page__button chef-page__button--light chef-dashboard__button"
                onClick={() => activeOrder && onDelivered(activeOrder.id)}
              >
                Delivered
              </button>
            </div>
          </article>

          <article className="chef-page__card chef-dashboard__card chef-dashboard__card--progress">
            <span className="chef-page__tag">Today</span>
            <h3>Kitchen Progress</h3>
            <p>
              {pendingOrders} awaiting, {acceptedOrders} in preparation, {liveOrders.length} total live orders.
            </p>
            <div className="chef-dashboard__progress-bar" aria-hidden="true">
              <span style={{ width: `${Math.max(18, Math.min(100, liveOrders.length * 18))}%` }} />
            </div>
            <div className="chef-page__hero-actions">
              <button type="button" className="chef-page__button chef-dashboard__button" onClick={onOpenOrders}>
                View Orders
              </button>
              <button type="button" className="chef-page__button chef-page__button--light chef-dashboard__button" onClick={onOpenMenu}>
                Open Menu
              </button>
            </div>
          </article>

          <article className="chef-page__card chef-dashboard__card chef-dashboard__card--payout">
            <span className="chef-page__tag">Revenue</span>
            <h3>Payout Summary</h3>
            <p>Weekly payout is scheduled for your linked bank account.</p>
            <button type="button" className="chef-page__button chef-page__button--light chef-dashboard__button" onClick={onOpenProfile}>
              Open Profile
            </button>
          </article>
        </div>

        <article className="chef-page__card chef-dashboard__card chef-dashboard__menu-card">
          <div className="chef-page__list-row chef-dashboard__menu-head">
            <div>
              <span className="chef-page__tag">Quick Menu Control</span>
              <h3>Update or delete dishes from dashboard</h3>
            </div>
            <button type="button" className="chef-page__button chef-page__button--light chef-dashboard__button" onClick={onOpenMenu}>
              Manage Menu
            </button>
          </div>
          <div className="chef-page__dashboard-menu">
            {menuItems.map((item, index) => (
              <article
                key={item.id}
                className="chef-page__dashboard-dish chef-dashboard__dish chef-dashboard__dish--animated"
                style={{ animationDelay: `${index * 90}ms` }}
              >
                <img src={item.image} alt={item.name} />
                <div>
                  <strong>{item.name}</strong>
                  <p>{item.price}</p>
                </div>
                <div className="chef-page__hero-actions">
                  <button
                    type="button"
                    className="chef-page__button chef-page__button--light chef-dashboard__button"
                    onClick={() => onEditMenuItem(item.id)}
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    className="chef-page__button chef-page__button--danger chef-dashboard__button"
                    onClick={() => onDeleteMenuItem(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
};

export default ChefDashboard;
