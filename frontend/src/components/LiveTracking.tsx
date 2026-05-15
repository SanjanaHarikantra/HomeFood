import { useEffect, useMemo, useRef, useState } from "react";
import "../styles/LiveTracking.css";

type TrackingStatus =
  | "PLACED"
  | "ACCEPTED"
  | "PREPARING"
  | "PICKED_UP"
  | "ON_THE_WAY"
  | "DELIVERED"
  | "CANCELLED";

type GpsPoint = {
  lat: number;
  lng: number;
};

type FeedItem = {
  id: string;
  source: "Restaurant" | "Delivery Partner" | "System";
  message: string;
  time: string;
};

type DeliveryTimelineStep = {
  label: string;
  completed: boolean;
  active?: boolean;
};

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
  timeline: DeliveryTimelineStep[];
  trackingId: string;
};

type LiveTrackingProps = {
  order?: { id: string } | null;
  delivery?: DeliverySnapshot | null;
};

const STATUS_FLOW: TrackingStatus[] = [
  "PLACED",
  "ACCEPTED",
  "PREPARING",
  "PICKED_UP",
  "ON_THE_WAY",
  "DELIVERED",
];

const STATUS_LABELS: Record<TrackingStatus, string> = {
  PLACED: "Order placed",
  ACCEPTED: "Accepted by restaurant",
  PREPARING: "Preparing",
  PICKED_UP: "Picked up",
  ON_THE_WAY: "On the way",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const mapExternalStatus = (value: string): TrackingStatus => {
  const status = value.toLowerCase();
  if (status.includes("delivered")) return "DELIVERED";
  if (status.includes("out for delivery") || status.includes("on the way")) return "ON_THE_WAY";
  if (status.includes("shipped") || status.includes("picked")) return "PICKED_UP";
  if (status.includes("preparing")) return "PREPARING";
  if (status.includes("accepted")) return "ACCEPTED";
  if (status.includes("rejected") || status.includes("cancelled")) return "CANCELLED";
  return "PLACED";
};

const RESTAURANT_LOCATION: GpsPoint = { lat: 12.9738, lng: 77.6205 };
const CUSTOMER_LOCATION: GpsPoint = { lat: 12.9664, lng: 77.6077 };

const formatTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

const toRad = (value: number) => (value * Math.PI) / 180;

const distanceKmBetween = (a: GpsPoint, b: GpsPoint) => {
  const earthRadiusKm = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return earthRadiusKm * c;
};

const interpolatePoint = (a: GpsPoint, b: GpsPoint, progress: number): GpsPoint => ({
  lat: a.lat + (b.lat - a.lat) * progress,
  lng: a.lng + (b.lng - a.lng) * progress,
});

const LiveTracking = ({ order, delivery }: LiveTrackingProps) => {
  const [status, setStatus] = useState<TrackingStatus>("PLACED");
  const [riderLocation, setRiderLocation] = useState<GpsPoint>(RESTAURANT_LOCATION);
  const [distanceKm, setDistanceKm] = useState(distanceKmBetween(RESTAURANT_LOCATION, CUSTOMER_LOCATION));
  const [etaMin, setEtaMin] = useState(24);
  const [message, setMessage] = useState("Your order has been placed.");
  const [updates, setUpdates] = useState<FeedItem[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);

  const movementProgressRef = useRef(0);
  const lastDistanceRef = useRef(distanceKmBetween(RESTAURANT_LOCATION, CUSTOMER_LOCATION));
  const hasDelayAppliedRef = useRef(false);
  const riderPauseTicksRef = useRef(0);
  const riderPausedOnceRef = useRef(false);

  const totalDistance = useMemo(
    () => distanceKmBetween(RESTAURANT_LOCATION, CUSTOMER_LOCATION),
    []
  );
  const riderName = delivery?.riderName ?? "Porter rider will be assigned shortly";
  const riderPhone = delivery?.riderPhone ?? "1800-180-1234";
  const vehicleType = delivery?.vehicleType ?? "Bike";
  const liveEta = delivery?.eta ?? `${etaMin} min`;
  const deliveryTimeline = delivery?.timeline ?? [
    { label: "Order Confirmed", completed: true, active: true },
    { label: "Chef Accepted", completed: false },
    { label: "Food Prepared", completed: false },
    { label: "Ready for Pickup", completed: false },
    { label: "Porter Assigned", completed: false },
    { label: "Picked Up", completed: false },
    { label: "On the Way", completed: false },
    { label: "Reached Nearby", completed: false },
    { label: "Delivered", completed: false },
  ];

  const pushFeed = (source: FeedItem["source"], entry: string) => {
    setUpdates((prev) => [
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        source,
        message: entry,
        time: formatTime(),
      },
      ...prev.slice(0, 7),
    ]);
  };

  const pushNotification = (entry: string) => {
    setNotifications((prev) => [entry, ...prev.slice(0, 3)]);
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(entry);
    }
  };

  const moveToStatus = (next: TrackingStatus) => {
    setStatus(next);

    if (next === "ACCEPTED") {
      const text = "Your order has been accepted and is being prepared.";
      setMessage(text);
      pushFeed("Restaurant", "Order accepted by kitchen.");
      pushNotification("Order accepted");
      return;
    }

    if (next === "PREPARING") {
      const text = "Your meal is being prepared.";
      setMessage(text);
      pushFeed("Restaurant", "Food preparation started.");
      return;
    }

    if (next === "PICKED_UP") {
      const text = "Your order has been picked up and is on the way.";
      setMessage(text);
      pushFeed("Delivery Partner", "Package picked up from restaurant.");
      pushNotification("Picked up");
      return;
    }

    if (next === "ON_THE_WAY") {
      const text = "Delivery partner is heading to your location.";
      setMessage(text);
      pushFeed("Delivery Partner", "Live GPS updates started.");
      return;
    }

    if (next === "DELIVERED") {
      const text = "Delivered successfully. Enjoy your meal.";
      setMessage(text);
      setEtaMin(0);
      setDistanceKm(0);
      pushFeed("System", "Order marked as delivered.");
      pushNotification("Delivered");
    }
  };

  useEffect(() => {
    pushFeed("System", "Tracking initialized.");
    if ("Notification" in window && Notification.permission === "default") {
      void Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!delivery?.orderStatus) return;
    const next = mapExternalStatus(delivery.orderStatus);
    setStatus(next);
    setMessage(delivery.orderStatus);
    if (next === "DELIVERED") {
      setEtaMin(0);
      setDistanceKm(0);
    }
  }, [delivery?.orderStatus]);

  useEffect(() => {
    if (delivery) {
      return;
    }

    if (status === "DELIVERED" || status === "CANCELLED") {
      return;
    }

    const lifecycleInterval = window.setInterval(() => {
      setStatus((current) => {
        if (current === "PLACED") {
          moveToStatus("ACCEPTED");
          return "ACCEPTED";
        }

        if (current === "ACCEPTED") {
          moveToStatus("PREPARING");
          return "PREPARING";
        }

        if (current === "PREPARING") {
          if (!hasDelayAppliedRef.current) {
            hasDelayAppliedRef.current = true;
            setEtaMin((prev) => prev + 6);
            setMessage("Preparation is taking longer than expected. ETA updated.");
            pushFeed("Restaurant", "Delay in preparation reported.");
            return "PREPARING";
          }
          moveToStatus("PICKED_UP");
          return "PICKED_UP";
        }

        if (current === "PICKED_UP") {
          moveToStatus("ON_THE_WAY");
          return "ON_THE_WAY";
        }

        return current;
      });
    }, 7000);

    return () => {
      window.clearInterval(lifecycleInterval);
    };
  }, [status]);

  useEffect(() => {
    if (status !== "ON_THE_WAY") {
      return;
    }

    const gpsInterval = window.setInterval(() => {
      const currentProgress = movementProgressRef.current;

      if (
        !riderPausedOnceRef.current &&
        currentProgress > 0.4 &&
        currentProgress < 0.55
      ) {
        riderPausedOnceRef.current = true;
        riderPauseTicksRef.current = 3;
      }

      if (riderPauseTicksRef.current > 0) {
        riderPauseTicksRef.current -= 1;
        if (riderPauseTicksRef.current === 2) {
          setEtaMin((prev) => prev + 3);
          setMessage("Rider is temporarily stopped. Recalculating route.");
          pushFeed("System", "Rider not moving. ETA recalculated.");
        }
        return;
      }

      const nextProgress = Math.min(1, currentProgress + 0.08);
      movementProgressRef.current = nextProgress;

      const nextPoint = interpolatePoint(RESTAURANT_LOCATION, CUSTOMER_LOCATION, nextProgress);
      const nextDistance = Math.max(0, totalDistance * (1 - nextProgress));

      const movedKm = Math.max(0, lastDistanceRef.current - nextDistance);
      const speedKmPerMin = Math.max(0.25, movedKm / (3 / 60));
      const nextEta = Math.max(1, Math.ceil(nextDistance / speedKmPerMin));

      lastDistanceRef.current = nextDistance;
      setRiderLocation(nextPoint);
      setDistanceKm(nextDistance);
      setEtaMin(nextEta);

      if (nextDistance <= 0.7 && nextDistance > 0.15) {
        setMessage(`Delivery partner is ${nextDistance.toFixed(1)} km away, arriving in ${nextEta} minutes.`);
        pushFeed("Delivery Partner", "Arriving soon near your location.");
        pushNotification("Near delivery");
      }

      if (nextDistance <= 0.15 || nextProgress >= 1) {
        moveToStatus("DELIVERED");
      }
    }, 3000);

    return () => {
      window.clearInterval(gpsInterval);
    };
  }, [status, totalDistance]);

  const activeIndex = STATUS_FLOW.indexOf(status === "CANCELLED" ? "ON_THE_WAY" : status);
  const mapLeft = `${Math.min(92, Math.max(6, movementProgressRef.current * 88 + 6))}%`;
  const mapTop = `${Math.min(78, Math.max(20, 52 - movementProgressRef.current * 20))}%`;

  const cancelOrder = () => {
    setStatus("CANCELLED");
    setMessage("Order cancelled. Tracking has stopped.");
    pushFeed("System", "Order cancelled by user.");
  };

  return (
    <div className="tracking card">
      <div className="tracking__rider">
        <div>
          <span className="tracking__eyebrow">Porter rider</span>
          <h4>{riderName}</h4>
          <p>{delivery?.orderStatus ?? "Chef is preparing your food"}</p>
        </div>
        <div className="tracking__rider-meta">
          <span>Phone: {riderPhone}</span>
          <span>Vehicle: {vehicleType}</span>
          <span>Live ETA: {liveEta}</span>
        </div>
        <div className="tracking__rider-actions">
          <a className="tracking__call" href={`tel:${riderPhone.replace(/\s+/g, "")}`}>Call Rider</a>
          <a className="tracking__support" href="mailto:support@dabba-wala.com?subject=Delivery%20Support">
            Support
          </a>
        </div>
      </div>

      <div className="tracking__map">
        <div className="tracking__map-overlay">
          <span>Restaurant</span>
          <span>Destination</span>
        </div>
        <div className="tracking__route" />
        {status === "ON_THE_WAY" && (
          <div className="scooter-dot" style={{ left: mapLeft, top: mapTop }}>
            🛵
          </div>
        )}
        {status === "DELIVERED" && <div className="tracking__delivered-pin">📍 Delivered</div>}
      </div>

      <div className="tracking__timeline">
        <h3>Live Tracking</h3>
        {order ? <p className="tracking__order-id">Order #{order.id}</p> : null}
        <p className="tracking__message">{message}</p>
        <div className="tracking__meta">
          <span>ETA: {etaMin} min</span>
          <span>Distance: {distanceKm.toFixed(1)} km</span>
          <span>Porter fee: ₹{delivery?.fee ?? 29}</span>
        </div>
        {status === "ON_THE_WAY" && (
          <p className="tracking__coords">
            GPS: {riderLocation.lat.toFixed(5)}, {riderLocation.lng.toFixed(5)}
          </p>
        )}

        <div className="tracking__timeline-card">
          <h4>Delivery Timeline</h4>
          <ul className="tracking__delivery-steps">
            {deliveryTimeline.map((step) => (
              <li
                key={step.label}
                className={`${step.completed ? "is-done" : ""} ${step.active ? "is-active" : ""}`.trim()}
              >
                <span />
                <small>{step.label}</small>
              </li>
            ))}
          </ul>
        </div>

        <ul className="tracking__steps">
          {STATUS_FLOW.map((step, index) => {
            const isDone = index < activeIndex || status === "DELIVERED";
            const isActive = status !== "DELIVERED" && index === activeIndex;
            return (
              <li key={step} className={isDone ? "done" : isActive ? "active" : "pending"}>
                <span className="tracking__step-icon">{isDone ? "✔" : isActive ? "●" : "○"}</span>
                <span>{STATUS_LABELS[step]}</span>
              </li>
            );
          })}
        </ul>

        {status !== "DELIVERED" && status !== "CANCELLED" && (
          <button type="button" className="tracking__cancel" onClick={cancelOrder}>
            Cancel Order
          </button>
        )}

        {status === "CANCELLED" && <p className="tracking__cancelled">Order cancelled. Tracking stopped.</p>}

        <div className="tracking__feed">
          <h4>Live Updates</h4>
          <ul>
            {updates.map((entry) => (
              <li key={entry.id}>
                <strong>{entry.source}</strong>: {entry.message} <small>{entry.time}</small>
              </li>
            ))}
          </ul>
        </div>

        {notifications.length > 0 && (
          <div className="tracking__notifications">
            <h4>Notifications</h4>
            <ul>
              {notifications.map((entry, index) => (
                <li key={`${entry}-${index}`}>{entry}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveTracking;
