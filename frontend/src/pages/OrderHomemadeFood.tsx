import { useEffect, useMemo, useState } from "react";
import "../styles/OrderHomemadeFood.css";
import {
  createChefReview,
  createHomemadeOrder,
  getHomeChefMenu,
  getHomeChefReviews,
  getHomeChefs,
  getOrderTracking,
  type BackendHomeChef,
  type BackendHomeChefMenuItem,
  type BackendHomeChefReview,
  type BackendHomeChefTracking,
} from "../lib/backend";

type SavedAddress = {
  id: string;
  type: "Home" | "Work" | "Other";
  fullAddress: string;
  name: string;
  phone: string;
  city: string;
  pincode: string;
  isDefault?: boolean;
};

type FilterKey = "All" | "Veg" | "Non-Veg" | "Healthy" | "Tiffin" | "Budget";
type TrackingStage = "Placed" | "Accepted" | "Preparing" | "Shipped" | "Out for Delivery" | "Delivered";

type OrderHomemadeFoodProps = {
  userId: number | null;
  addresses: SavedAddress[];
  selectedAddressId: string | null;
  onSelectAddress: (id: string) => void;
};

const FILTERS: FilterKey[] = ["All", "Veg", "Non-Veg", "Healthy", "Tiffin", "Budget"];
const PAYMENT_METHODS = ["UPI", "Card", "Wallet", "Cash on Delivery"];
const DELIVERY_SLOTS = ["Lunch - 12:00 PM", "Lunch - 1:30 PM", "Dinner - 8:00 PM"];

const FALLBACK_CHEFS: BackendHomeChef[] = [
  {
    id: 1,
    chef_name: "Sushmita Joshi",
    kitchen_name: "Aai's Kitchen",
    area: "Bandra West",
    city: "Mumbai",
    cuisine_tag: "Veg",
    bio: "Warm Maharashtrian thalis, khichdi bowls, and weekly tiffin plans.",
    rating: 4.8,
    review_count: 128,
    delivery_time_mins: 28,
    delivery_radius_km: 6.5,
    veg_only: 1,
    image_url:
      "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=1200&q=80",
    is_active: 1,
    menu_count: 3,
  },
  {
    id: 2,
    chef_name: "Ayesha Khan",
    kitchen_name: "Noor Home Kitchen",
    area: "Andheri East",
    city: "Mumbai",
    cuisine_tag: "Healthy",
    bio: "Protein-rich bowls, low-oil lunchboxes, and office-friendly meals.",
    rating: 4.7,
    review_count: 96,
    delivery_time_mins: 30,
    delivery_radius_km: 6,
    veg_only: 0,
    image_url:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80",
    is_active: 1,
    menu_count: 3,
  },
  {
    id: 3,
    chef_name: "Meenal Patil",
    kitchen_name: "Weekend Dabba Studio",
    area: "Powai",
    city: "Mumbai",
    cuisine_tag: "Budget",
    bio: "Pocket-friendly homestyle meals with rotating specials and family packs.",
    rating: 4.6,
    review_count: 74,
    delivery_time_mins: 35,
    delivery_radius_km: 5,
    veg_only: 1,
    image_url:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    is_active: 1,
    menu_count: 1,
  },
];

const FALLBACK_REVIEWS: Record<number, BackendHomeChefReview[]> = {
  1: [
    {
      id: 1,
      chef_id: 1,
      customer_id: null,
      order_id: null,
      rating: 5,
      review_text: "Feels like home every day. Very consistent taste.",
      created_at: new Date().toISOString(),
      customer_name: "Rahul",
    },
    {
      id: 2,
      chef_id: 1,
      customer_id: null,
      order_id: null,
      rating: 5,
      review_text: "Perfect tiffin portions and always delivered warm.",
      created_at: new Date().toISOString(),
      customer_name: "Neha",
    },
  ],
  2: [
    {
      id: 3,
      chef_id: 2,
      customer_id: null,
      order_id: null,
      rating: 5,
      review_text: "Great healthy meals for work days.",
      created_at: new Date().toISOString(),
      customer_name: "Amit",
    },
  ],
  3: [
    {
      id: 4,
      chef_id: 3,
      customer_id: null,
      order_id: null,
      rating: 4,
      review_text: "Budget-friendly and surprisingly tasty.",
      created_at: new Date().toISOString(),
      customer_name: "Priya",
    },
  ],
};

const FALLBACK_MENU: Record<number, BackendHomeChefMenuItem[]> = {
  1: [
    {
      id: 101,
      chef_id: 1,
      title: "Aai's Daily Thali",
      description: "2 phulka, dal fry, jeera rice, sabzi and salad",
      price: 169,
      category: "Lunch",
      tags: "veg,thali,tiffin,budget",
      image_url:
        "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80",
      is_veg: 1,
      is_healthy: 0,
      is_tiffin: 1,
      is_budget: 1,
      is_available: 1,
    },
    {
      id: 102,
      chef_id: 1,
      title: "Comfort Khichdi Combo",
      description: "Moong dal khichdi, ghee, papad, buttermilk",
      price: 149,
      category: "Healthy",
      tags: "veg,healthy,tiffin",
      image_url:
        "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80",
      is_veg: 1,
      is_healthy: 1,
      is_tiffin: 1,
      is_budget: 1,
      is_available: 1,
    },
    {
      id: 103,
      chef_id: 1,
      title: "Paneer Millet Bowl",
      description: "Millet pulao, paneer tikka, saute veggies",
      price: 229,
      category: "Healthy",
      tags: "veg,healthy,premium",
      image_url:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
      is_veg: 1,
      is_healthy: 1,
      is_tiffin: 0,
      is_budget: 0,
      is_available: 1,
    },
  ],
  2: [
    {
      id: 201,
      chef_id: 2,
      title: "Chicken Curry Tiffin",
      description: "Steamed rice, home-style chicken curry, salad",
      price: 249,
      category: "Dinner",
      tags: "non-veg,tiffin",
      image_url:
        "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1200&q=80",
      is_veg: 0,
      is_healthy: 0,
      is_tiffin: 1,
      is_budget: 0,
      is_available: 1,
    },
    {
      id: 202,
      chef_id: 2,
      title: "Protein Power Box",
      description: "Brown rice, tofu masala, sprouts, curd",
      price: 219,
      category: "Healthy",
      tags: "veg,healthy,protein",
      image_url:
        "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=80",
      is_veg: 1,
      is_healthy: 1,
      is_tiffin: 1,
      is_budget: 0,
      is_available: 1,
    },
    {
      id: 203,
      chef_id: 2,
      title: "Healthy Lunch Bowl",
      description: "Brown rice, grilled paneer, veggie curry, salad",
      price: 199,
      category: "Healthy",
      tags: "veg,healthy,budget",
      image_url:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
      is_veg: 1,
      is_healthy: 1,
      is_tiffin: 1,
      is_budget: 1,
      is_available: 1,
    },
  ],
  3: [
    {
      id: 301,
      chef_id: 3,
      title: "Budget Dal Rice",
      description: "Rice, dal tadka, cabbage sabzi and pickle",
      price: 129,
      category: "Budget",
      tags: "veg,budget,tiffin",
      image_url:
        "https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=1200&q=80",
      is_veg: 1,
      is_healthy: 0,
      is_tiffin: 1,
      is_budget: 1,
      is_available: 1,
    },
  ],
};

const TRACKING_FLOW: TrackingStage[] = ["Placed", "Accepted", "Preparing", "Shipped", "Out for Delivery", "Delivered"];

const formatMoney = (value: number) => `₹${value.toFixed(0)}`;

const startOfDay = (daysFromNow: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(9, 0, 0, 0);
  return date;
};

const buildAutoOrderPreview = (plan: string) => {
  if (plan === "Weekly") {
    return [1, 2, 3, 4, 5].map((day) => startOfDay(day).toLocaleDateString());
  }
  if (plan === "Monthly") {
    return [1, 7, 14, 21, 28].map((day) => startOfDay(day).toLocaleDateString());
  }
  return [1, 2, 3].map((day) => startOfDay(day).toLocaleDateString());
};

const OrderHomemadeFood = ({
  userId,
  addresses,
  selectedAddressId,
  onSelectAddress,
}: OrderHomemadeFoodProps) => {
  const [chefs, setChefs] = useState<BackendHomeChef[]>(FALLBACK_CHEFS);
  const [selectedChefId, setSelectedChefId] = useState<number>(FALLBACK_CHEFS[0]?.id ?? 1);
  const [menu, setMenu] = useState<BackendHomeChefMenuItem[]>(FALLBACK_MENU[FALLBACK_CHEFS[0]?.id ?? 1] ?? []);
  const [reviews, setReviews] = useState<BackendHomeChefReview[]>(FALLBACK_REVIEWS[FALLBACK_CHEFS[0]?.id ?? 1] ?? []);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>("All");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [deliverySlot, setDeliverySlot] = useState(DELIVERY_SLOTS[0]);
  const [manualAddress, setManualAddress] = useState("");
  const [note, setNote] = useState("Less spicy, please");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [tracking, setTracking] = useState<BackendHomeChefTracking | null>(null);
  const [trackingStage, setTrackingStage] = useState<TrackingStage>("Placed");
  const [trackingMessage, setTrackingMessage] = useState("Choose dishes from a nearby home chef.");
  const [orderLoading, setOrderLoading] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("Warm, tasty and packed with care.");
  const [subscriptionPlan, setSubscriptionPlan] = useState("Weekly");
  const [subscriptionEnabled, setSubscriptionEnabled] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [orderCode, setOrderCode] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        const data = await getHomeChefs({
          search,
          veg: filter === "Veg",
          nonVeg: filter === "Non-Veg",
          healthy: filter === "Healthy",
          tiffin: filter === "Tiffin",
          budget: filter === "Budget",
        });

        setChefs(data.length > 0 ? data : FALLBACK_CHEFS);
      } catch {
        setChefs(FALLBACK_CHEFS);
      }
    })();
  }, [filter, search]);

  useEffect(() => {
    const chef = chefs.find((item) => item.id === selectedChefId) ?? chefs[0];
    if (!chef) return;

    void (async () => {
      try {
        const [nextMenu, nextReviews] = await Promise.all([
          getHomeChefMenu(chef.id, {
            search,
            veg: filter === "Veg",
            healthy: filter === "Healthy",
            tiffin: filter === "Tiffin",
            budget: filter === "Budget",
          }),
          getHomeChefReviews(chef.id),
        ]);
        setMenu(nextMenu.length > 0 ? nextMenu : FALLBACK_MENU[chef.id] ?? []);
        setReviews(nextReviews.length > 0 ? nextReviews : FALLBACK_REVIEWS[chef.id] ?? []);
      } catch {
        setMenu(FALLBACK_MENU[chef.id] ?? []);
        setReviews(FALLBACK_REVIEWS[chef.id] ?? []);
      }
    })();
  }, [chefs, filter, search, selectedChefId]);

  const selectedChef = chefs.find((item) => item.id === selectedChefId) ?? chefs[0] ?? null;
  const selectedAddress = addresses.find((address) => address.id === selectedAddressId) ?? null;

  useEffect(() => {
    if (!selectedChef) return;
    setMenu((prev) => (prev.length > 0 ? prev : FALLBACK_MENU[selectedChef.id] ?? []));
    setReviews((prev) => (prev.length > 0 ? prev : FALLBACK_REVIEWS[selectedChef.id] ?? []));
  }, [selectedChef]);

  useEffect(() => {
    if (!tracking) return;
    const interval = window.setInterval(() => {
      if (userId && tracking.order?.id) {
        void getOrderTracking(userId, tracking.order.id)
          .then((nextTracking) => {
            const nextStatus = nextTracking.order.status as TrackingStage;
            setTracking(nextTracking);
            if (TRACKING_FLOW.includes(nextStatus)) {
              setTrackingStage(nextStatus);
              setTrackingMessage(`Chef updated your order: ${nextStatus}.`);
            }
          })
          .catch(() => undefined);
        return;
      }

      setTrackingStage((current) => {
        const currentIndex = TRACKING_FLOW.indexOf(current);
        const next = TRACKING_FLOW[Math.min(TRACKING_FLOW.length - 1, currentIndex + 1)];
        if (next === current) {
          return current;
        }

        const nextMessage =
          next === "Accepted"
            ? "Chef accepted the order and started preparing."
            : next === "Preparing"
              ? "Food is being prepared in the home kitchen."
              : next === "Shipped"
                ? "Food is packed and handed over."
                : next === "Out for Delivery"
                  ? "Delivery partner is on the way."
                  : next === "Delivered"
                    ? "Delivered successfully. Enjoy your homemade meal."
                    : "Your order has been placed.";
        setTrackingMessage(nextMessage);

        return next;
      });
    }, 5000);

    return () => window.clearInterval(interval);
  }, [tracking, userId]);

  useEffect(() => {
    if (!orderId || !userId) return;
    void (async () => {
      try {
        const nextTracking = await getOrderTracking(userId, orderId);
        setTracking(nextTracking);
      } catch {
        setTracking(null);
      }
    })();
  }, [orderId, userId]);

  const visibleMenu = useMemo(() => {
    return menu.filter((item) => {
      const haystack = [item.title, item.description, item.category, item.tags || ""].join(" ").toLowerCase();
      if (search.trim() && !haystack.includes(search.trim().toLowerCase())) {
        return false;
      }
      if (filter === "Veg" && Number(item.is_veg) !== 1) return false;
      if (filter === "Non-Veg" && Number(item.is_veg) === 1) return false;
      if (filter === "Healthy" && Number(item.is_healthy) !== 1) return false;
      if (filter === "Tiffin" && Number(item.is_tiffin) !== 1) return false;
      if (filter === "Budget" && Number(item.is_budget) !== 1) return false;
      return true;
    });
  }, [filter, menu, search]);

  const cartItems = useMemo(() => {
    return Object.entries(cart)
      .map(([menuItemId, quantity]) => {
        const item = menu.find((entry) => entry.id === Number(menuItemId));
        if (!item) return null;
        return {
          ...item,
          quantity,
          total: Number(item.price) * quantity,
        };
      })
      .filter(Boolean) as Array<BackendHomeChefMenuItem & { quantity: number; total: number }>;
  }, [cart, menu]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
  const deliveryFee = selectedChef?.veg_only ? 19 : 29;
  const total = subtotal + deliveryFee;
  const activeAddress = selectedAddress?.fullAddress || manualAddress.trim();
  const autoOrderPreview = useMemo(() => buildAutoOrderPreview(subscriptionPlan), [subscriptionPlan]);

  const addItem = (menuItem: BackendHomeChefMenuItem) => {
    setCart((prev) => ({ ...prev, [menuItem.id]: (prev[menuItem.id] || 0) + 1 }));
  };

  const changeQuantity = (menuItemId: number, delta: number) => {
    setCart((prev) => {
      const next = Math.max(0, (prev[menuItemId] || 0) + delta);
      const copy = { ...prev };
      if (next === 0) {
        delete copy[menuItemId];
      } else {
        copy[menuItemId] = next;
      }
      return copy;
    });
  };

  const placeOrder = async () => {
    if (!selectedChef) return;
    if (cartItems.length === 0) {
      setTrackingMessage("Add at least one dish before placing the order.");
      return;
    }
    if (!activeAddress) {
      setTrackingMessage("Please choose a saved address or enter a delivery address.");
      return;
    }
    setOrderLoading(true);

    const payload = {
      items: cartItems.map((item) => ({ menuItemId: item.id, quantity: item.quantity })),
      addressId: Number(selectedAddressId || Date.now()),
      paymentMethod,
      deliverySlot,
      note,
    };

    try {
      if (userId && selectedAddressId) {
        const created = await createHomemadeOrder(userId, selectedChef.id, payload);
        setOrderId(created.id);
        setOrderCode(created.order_code);
        setTracking({
          order: created,
          chef: created.chef ?? selectedChef,
          delivery: created.delivery
            ? {
                id: created.id,
                order_id: created.id,
                partner_name: created.delivery.riderName,
                partner_phone: created.delivery.riderPhone,
                vehicle_type: created.delivery.vehicleType,
                status: created.delivery.orderStatus,
                eta_minutes: 30,
                pickup_time: null,
                dropoff_time: null,
                created_at: new Date().toISOString(),
              }
            : null,
          events: [
            {
              id: Date.now(),
              order_id: created.id,
              status: "Placed",
              note: "Order placed from the homemade food module.",
              created_at: new Date().toISOString(),
            },
          ],
          timeline: TRACKING_FLOW.map((status) => ({
            label: status,
            completed: status === "Placed",
            active: status === "Placed",
          })),
        });
      } else {
        const demoOrderId = Date.now();
        setOrderId(demoOrderId);
        setOrderCode(`HFO-${demoOrderId}`);
        setTracking({
          order: {
            id: demoOrderId,
            order_code: `HFO-${demoOrderId}`,
            user_id: userId || 0,
            chef_id: selectedChef.id,
            address_id: Number(selectedAddressId || demoOrderId),
            order_type: "homemade",
            payment_method: paymentMethod,
            subtotal,
            discount: 0,
            total,
            status: "Placed",
            created_at: new Date().toISOString(),
          },
          chef: selectedChef,
          delivery: {
            id: demoOrderId,
            order_id: demoOrderId,
            partner_name: "Porter Rider",
            partner_phone: "1800-180-1234",
            vehicle_type: "Bike",
            status: "Assigned",
            eta_minutes: 30,
            pickup_time: null,
            dropoff_time: null,
            created_at: new Date().toISOString(),
          },
          events: [
            {
              id: demoOrderId,
              order_id: demoOrderId,
              status: "Placed",
              note: "Order placed in demo mode.",
              created_at: new Date().toISOString(),
            },
          ],
          timeline: TRACKING_FLOW.map((status) => ({
            label: status,
            completed: status === "Placed",
            active: status === "Placed",
          })),
        });
      }

      setCart({});
      setTrackingStage("Placed");
      setTrackingMessage("Your order is placed and waiting for chef confirmation.");
    } catch {
      setTrackingMessage("Could not place the order right now.");
    } finally {
      setOrderLoading(false);
    }
  };

  const submitReview = async () => {
    if (!selectedChef) return;
    if (!reviewText.trim()) return;
    try {
      const created = await createChefReview(selectedChef.id, {
        customerId: userId || null,
        orderId: orderId || null,
        rating: reviewRating,
        reviewText,
      });
      setReviews((prev) => [created, ...prev]);
      setTrackingMessage("Review submitted. Thank you for helping other customers.");
    } catch {
      setTrackingMessage("Could not submit review right now.");
    }
  };

  return (
    <section className="homemade">
      <div className="homemade__hero card fade-in">
        <div className="homemade__hero-copy">
          <div className="homemade__hero-topline">
            <span className="homemade__eyebrow">Customer Side</span>
            <span className="homemade__hero-badge">Live tiffin marketplace</span>
          </div>
          <h1>Continue as Order Homemade Food</h1>
          <p>
            Discover nearby home chefs, build your cart, place an order, and keep a live eye on
            the kitchen, rider, and delivery timeline.
          </p>
          <div className="homemade__hero-actions">
            <button className="btn" type="button" onClick={() => setFilter("All")}>
              Explore chefs
            </button>
            <button className="btn btn-outline" type="button" onClick={() => (window.location.hash = "#subscriptions")}>
              Subscription plans
            </button>
          </div>
          <div className="homemade__trust-row">
            <div>
              <strong>4.8/5</strong>
              <span>Avg chef rating</span>
            </div>
            <div>
              <strong>25-35 min</strong>
              <span>Typical delivery</span>
            </div>
            <div>
              <strong>3 meal plans</strong>
              <span>Daily, weekly, monthly</span>
            </div>
          </div>
        </div>

        <div className="homemade__hero-stats">
          <div className="homemade__feature-card">
            <span className="homemade__feature-kicker">Featured Chef</span>
            <strong>{selectedChef?.kitchen_name ?? "Aai's Kitchen"}</strong>
            <p>{selectedChef?.bio ?? "Warm Maharashtrian thalis, khichdi bowls, and weekly tiffin plans."}</p>
          </div>
          <div className="homemade__stat">
            <strong>45 mins</strong>
            <span>Average delivery</span>
          </div>
          <div className="homemade__stat">
            <strong>Daily / Weekly / Monthly</strong>
            <span>Auto-order tiffin plans</span>
          </div>
          <div className="homemade__stat">
            <strong>Live order tracking</strong>
            <span>Accepted to Delivered</span>
          </div>
        </div>
      </div>

      <section className="homemade__toolbar card">
        <div className="homemade__toolbar-search">
          <input
            type="text"
            placeholder="Search chefs, meals, tiffin, healthy, budget..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <button type="button" className="btn btn-outline" onClick={() => setSearch("")}>
            Clear
          </button>
        </div>
        <div className="homemade__filters">
          <span className="homemade__filters-label">Quick filters</span>
          {FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              className={`homemade__chip ${filter === item ? "is-active" : ""}`}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="homemade__section">
        <div className="homemade__section-head">
          <div>
            <h2>Today&apos;s Specials</h2>
            <p>Trending dishes from trusted home kitchens.</p>
          </div>
        </div>
        <div className="homemade__specials">
          {visibleMenu.slice(0, 3).map((item) => (
            <article key={item.id} className="homemade__special card">
              <img src={item.image_url || ""} alt={item.title} />
              <div>
                <span className="badge">{item.category}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="homemade__special-row">
                  <strong>{formatMoney(Number(item.price))}</strong>
                  <button type="button" className="btn btn-outline" onClick={() => addItem(item)}>
                    Add to cart
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="homemade__layout">
        <div className="homemade__main">
          <section className="homemade__section">
            <div className="homemade__section-head">
              <div>
                <h2>Nearby Home Chefs</h2>
                <p>Choose a kitchen, then explore their full menu and reviews.</p>
              </div>
            </div>
            <div className="homemade__chef-grid">
              {chefs.map((chef) => (
                <button
                  key={chef.id}
                  type="button"
                  className={`homemade__chef card ${selectedChefId === chef.id ? "is-selected" : ""}`}
                  onClick={() => setSelectedChefId(chef.id)}
                >
                  <img src={chef.image_url || ""} alt={chef.kitchen_name} />
                  <div className="homemade__chef-body">
                    <span className="badge">{chef.cuisine_tag}</span>
                    <h3>{chef.kitchen_name}</h3>
                    <p>{chef.area}, {chef.city}</p>
                    <div className="homemade__meta">
                      <span>{chef.rating}★</span>
                      <span>{chef.review_count} reviews</span>
                      <span>{chef.delivery_time_mins} mins</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {selectedChef && (
            <section className="homemade__section card homemade__profile">
              <div className="homemade__profile-hero">
                <img src={selectedChef.image_url || ""} alt={selectedChef.kitchen_name} />
                <div>
                  <span className="homemade__eyebrow">Chef Profile</span>
                  <h2>{selectedChef.kitchen_name}</h2>
                  <p>{selectedChef.bio}</p>
                  <div className="homemade__meta">
                    <span>{selectedChef.chef_name}</span>
                    <span>{selectedChef.area}, {selectedChef.city}</span>
                    <span>{selectedChef.delivery_radius_km} km radius</span>
                  </div>
                </div>
              </div>

              <div className="homemade__profile-grid">
                <div>
                  <h3>Menu</h3>
                  <div className="homemade__menu">
                    {visibleMenu.map((item) => (
                      <article key={item.id} className="homemade__menu-item">
                        <img src={item.image_url || ""} alt={item.title} />
                        <div>
                          <span className="badge">{item.category}</span>
                          <h4>{item.title}</h4>
                          <p>{item.description}</p>
                          <div className="homemade__menu-row">
                            <strong>{formatMoney(Number(item.price))}</strong>
                            <div className="homemade__qty">
                              <button type="button" onClick={() => changeQuantity(item.id, -1)}>-</button>
                              <span>{cart[item.id] || 0}</span>
                              <button type="button" onClick={() => changeQuantity(item.id, 1)}>+</button>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>

                <aside className="homemade__reviews">
                  <h3>Reviews</h3>
                  <div className="homemade__review-list">
                    {reviews.map((review) => (
                      <article key={review.id} className="homemade__review">
                        <strong>{review.customer_name || "Customer"}</strong>
                        <span>{review.rating}★</span>
                        <p>{review.review_text}</p>
                      </article>
                    ))}
                  </div>
                </aside>
              </div>
            </section>
          )}
        </div>

        <aside className="homemade__sidebar">
          <section className="homemade__section card">
            <h3>Cart</h3>
            {cartItems.length === 0 ? (
              <p className="muted">No items yet. Add dishes from the menu.</p>
            ) : (
              <div className="homemade__cart">
                {cartItems.map((item) => (
                  <div key={item.id} className="homemade__cart-row">
                    <div>
                      <strong>{item.title}</strong>
                      <small>{item.quantity} x {formatMoney(Number(item.price))}</small>
                    </div>
                    <strong>{formatMoney(item.total)}</strong>
                  </div>
                ))}
              </div>
            )}
            <div className="homemade__bill">
              <div><span>Subtotal</span><strong>{formatMoney(subtotal)}</strong></div>
              <div><span>Delivery</span><strong>{formatMoney(deliveryFee)}</strong></div>
              <div className="total"><span>Total</span><strong>{formatMoney(total)}</strong></div>
            </div>
          </section>

          <section className="homemade__section card">
            <h3>Checkout</h3>
            <div className="homemade__field">
              <label>Delivery address</label>
              {addresses.length > 0 && (
                <div className="homemade__saved-addresses">
                  {addresses.map((address) => (
                    <button
                      key={address.id}
                      type="button"
                      className={`homemade__saved-address ${selectedAddressId === address.id ? "is-active" : ""}`}
                      onClick={() => onSelectAddress(address.id)}
                    >
                      <strong>{address.type}</strong>
                      <span>{address.fullAddress}</span>
                    </button>
                  ))}
                </div>
              )}
              <textarea
                rows={3}
                placeholder="Or type a delivery address for demo checkout"
                value={manualAddress}
                onChange={(event) => setManualAddress(event.target.value)}
              />
              <button type="button" className="btn btn-outline" onClick={() => (window.location.hash = "#addresses")}>
                Manage addresses
              </button>
            </div>

            <div className="homemade__field">
              <label>Delivery slot</label>
              <select value={deliverySlot} onChange={(event) => setDeliverySlot(event.target.value)}>
                {DELIVERY_SLOTS.map((slot) => (
                  <option key={slot}>{slot}</option>
                ))}
              </select>
            </div>

            <div className="homemade__field">
              <label>Payment</label>
              <div className="homemade__saved-addresses">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method}
                    type="button"
                    className={`homemade__saved-address ${paymentMethod === method ? "is-active" : ""}`}
                    onClick={() => setPaymentMethod(method)}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <div className="homemade__field">
              <label>Chef note</label>
              <textarea rows={2} value={note} onChange={(event) => setNote(event.target.value)} />
            </div>

            <button className="btn homemade__place" type="button" onClick={() => void placeOrder()} disabled={orderLoading}>
              {orderLoading ? "Placing order..." : "Place Homemade Order"}
            </button>

            <p className="muted">
              Home Chef integration posts the order to the chef module and creates a delivery
              assignment for the partner module.
            </p>
          </section>

          <section className="homemade__section card">
            <h3>Subscriptions</h3>
            <div className="homemade__subscription-row">
              {["Daily", "Weekly", "Monthly"].map((plan) => (
                <button
                  key={plan}
                  type="button"
                  className={`homemade__plan ${subscriptionPlan === plan ? "is-active" : ""}`}
                  onClick={() => setSubscriptionPlan(plan)}
                >
                  {plan}
                </button>
              ))}
            </div>
            <label className="homemade__toggle">
              <input type="checkbox" checked={subscriptionEnabled} onChange={(event) => setSubscriptionEnabled(event.target.checked)} />
              Enable auto-order generation for subscribed users
            </label>
            {subscriptionEnabled && (
              <div className="homemade__subscription-preview">
                <strong>{subscriptionPlan} meal plan</strong>
                <ul>
                  {autoOrderPreview.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            <button type="button" className="btn btn-outline" onClick={() => (window.location.hash = "#subscriptions")}>
              Open subscription center
            </button>
          </section>

          <section className="homemade__section card">
            <h3>Live Tracking</h3>
            <p className="muted">{trackingMessage}</p>
            {orderCode && <p className="muted">Order: {orderCode}</p>}
            <div className="homemade__timeline">
              {TRACKING_FLOW.map((stage) => (
                <div key={stage} className={`homemade__timeline-item ${trackingStage === stage ? "is-active" : TRACKING_FLOW.indexOf(stage) < TRACKING_FLOW.indexOf(trackingStage) ? "is-done" : ""}`}>
                  <span />
                  <strong>{stage}</strong>
                </div>
              ))}
            </div>
            {tracking?.delivery && (
              <div className="homemade__delivery-card">
                <strong>{tracking.delivery.partner_name}</strong>
                <p>{tracking.delivery.partner_phone}</p>
                <p>{tracking.delivery.vehicle_type} • ETA {tracking.delivery.eta_minutes} min</p>
              </div>
            )}
          </section>

          <section className="homemade__section card">
            <h3>Write a review</h3>
            <label className="homemade__field">
              <span>Rating</span>
              <select value={reviewRating} onChange={(event) => setReviewRating(Number(event.target.value))}>
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>{value} star{value > 1 ? "s" : ""}</option>
                ))}
              </select>
            </label>
            <label className="homemade__field">
              <span>Review</span>
              <textarea rows={3} value={reviewText} onChange={(event) => setReviewText(event.target.value)} />
            </label>
            <button type="button" className="btn btn-outline" onClick={() => void submitReview()}>
              Submit review
            </button>
          </section>
        </aside>
      </section>
    </section>
  );
};

export default OrderHomemadeFood;
