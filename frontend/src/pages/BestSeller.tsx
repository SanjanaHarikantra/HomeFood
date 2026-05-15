import { useMemo, useState } from "react";
import "../styles/BestSeller.css";

type BestItem = {
  id: string;
  name: string;
  restaurant: string;
  price: number;
  rating: number;
  orders: number;
  eta: number;
  image: string;
};

const BEST_ITEMS: BestItem[] = [
  {
    id: "bs-1",
    name: "Chicken Burger",
    restaurant: "Burger Craft",
    price: 185,
    rating: 4.7,
    orders: 5000,
    eta: 22,
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "bs-2",
    name: "Paneer Butter Masala",
    restaurant: "Aai’s Kitchen",
    price: 210,
    rating: 4.6,
    orders: 4200,
    eta: 25,
    image:
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "bs-3",
    name: "Veg Millet Bowl",
    restaurant: "Healthy Bowls",
    price: 195,
    rating: 4.5,
    orders: 3800,
    eta: 28,
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "bs-4",
    name: "Chicken Biryani",
    restaurant: "Biryani Junction",
    price: 240,
    rating: 4.4,
    orders: 6100,
    eta: 30,
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80",
  },
];

const BestSeller = () => {
  const [sortBy, setSortBy] = useState<"orders" | "rating" | "eta">("orders");
  const [minRating, setMinRating] = useState(0);
  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    window.location.hash = "#home";
  };

  const filtered = useMemo(() => {
    return BEST_ITEMS.filter((item) => (minRating ? item.rating >= minRating : true));
  }, [minRating]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    switch (sortBy) {
      case "rating":
        return list.sort((a, b) => b.rating - a.rating);
      case "eta":
        return list.sort((a, b) => a.eta - b.eta);
      default:
        return list.sort((a, b) => b.orders - a.orders);
    }
  }, [filtered, sortBy]);

  return (
    <section className="section best-seller">
      <div className="best-seller__top">
        <button type="button" className="pill" onClick={handleBack}>
          Back
        </button>
        <h1>Top Picks for You</h1>
        <p>Most ordered dishes, trusted by thousands of customers.</p>
      </div>

      <div className="best-seller__controls">
        <div className="best-seller__filters">
          <label>
            Rating
            <select value={minRating} onChange={(e) => setMinRating(Number(e.target.value))}>
              <option value={0}>Any</option>
              <option value={4}>4★ and above</option>
              <option value={4.5}>4.5★ and above</option>
            </select>
          </label>
        </div>
        <div className="best-seller__sort">
          <span>Sort by</span>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}>
            <option value="orders">Most Ordered</option>
            <option value="rating">Rating</option>
            <option value="eta">Fastest Delivery</option>
          </select>
        </div>
      </div>

      <div className="best-seller__list">
        {sorted.map((item) => (
          <div key={item.id} className="best-seller__card">
            <img src={item.image} alt={item.name} />
            <div className="best-seller__body">
              <div className="best-seller__row">
                <strong>{item.name}</strong>
                <span className="best-seller__badge">Best Seller</span>
              </div>
              <span className="best-seller__restaurant">{item.restaurant}</span>
              <div className="best-seller__meta">
                <span>⭐ {item.rating.toFixed(1)}</span>
                <span>{item.orders.toLocaleString()}+ orders</span>
                <span>{item.eta} mins</span>
              </div>
              <div className="best-seller__price">₹{item.price}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BestSeller;
