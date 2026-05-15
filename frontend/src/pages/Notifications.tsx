import { useMemo, useState } from "react";
import "../styles/Notifications.css";

const defaultNotifications = [
  {
    id: 1,
    title: "Order Delivered",
    detail: "Your Namma Bowls order was delivered at 08:32 PM.",
    time: "2 min ago",
    unread: true,
  },
  {
    id: 2,
    title: "Smart Reminder",
    detail: "Water reminder is set for 4:00 PM today.",
    time: "1 hour ago",
    unread: false,
  },
  {
    id: 3,
    title: "Subscription Alert",
    detail: "Your monthly subscription ends in 4 days.",
    time: "Today",
    unread: false,
  },
  {
    id: 4,
    title: "Nearby Kitchen",
    detail: "Aai's Dabba is delivering in your area right now.",
    time: "Today",
    unread: false,
  },
];

const Notifications = () => {
  const [items, setItems] = useState(defaultNotifications);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  const visibleItems = useMemo(() => {
    if (filter === "unread") return items.filter((item) => item.unread);
    if (filter === "read") return items.filter((item) => !item.unread);
    return items;
  }, [filter, items]);

  const markAllRead = () => {
    setItems((prev) => prev.map((item) => ({ ...item, unread: false })));
  };

  const toggleRead = (id: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, unread: !item.unread } : item))
    );
  };

  return (
    <section className="notifications-page fade-in">
      <div className="notifications-header">
        <h1>Notifications</h1>
        <div className="notifications-actions">
          <button className="btn btn-outline" onClick={markAllRead}>
            Mark All Read
          </button>
          <a className="btn btn-outline" href="#profile">
            Back to Profile
          </a>
        </div>
      </div>

      <div className="notifications-filters">
        <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>
          All
        </button>
        <button className={filter === "unread" ? "active" : ""} onClick={() => setFilter("unread")}>
          Unread
        </button>
        <button className={filter === "read" ? "active" : ""} onClick={() => setFilter("read")}>
          Read
        </button>
      </div>

      <div className="notifications-list">
        {visibleItems.map((item) => (
          <article
            key={item.id}
            className={`notification-card ${item.unread ? "is-unread" : ""}`}
            onClick={() => toggleRead(item.id)}
          >
            <div className="notification-top">
              <h3>{item.title}</h3>
              <span>{item.time}</span>
            </div>
            <p>{item.detail}</p>
            <small className="notification-status">{item.unread ? "Unread" : "Read"}</small>
          </article>
        ))}
        {!visibleItems.length && <p className="notifications-empty">No notifications in this tab.</p>}
      </div>
    </section>
  );
};

export default Notifications;
