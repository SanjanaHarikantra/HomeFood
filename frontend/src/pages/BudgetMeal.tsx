import { useMemo, useState } from "react";
import "../styles/BudgetMeal.css";

type BudgetItem = {
  id: string;
  name: string;
  restaurant: string;
  price: number;
  rating: number;
  eta: number;
  image: string;
  tags: string[];
};

const BUDGET_ITEMS: BudgetItem[] = [
  {
    id: "bm-1",
    name: "Veg Combo Meal",
    restaurant: "Tiffin Express",
    price: 4.99,
    rating: 4.2,
    eta: 22,
    image:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80",
    tags: ["Budget", "Best Value"],
  },
  {
    id: "bm-2",
    name: "Chicken Wrap",
    restaurant: "Burger Craft",
    price: 7.5,
    rating: 4.4,
    eta: 26,
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
    tags: ["Student Favorite"],
  },
  {
    id: "bm-3",
    name: "Healthy Bowl",
    restaurant: "Healthy Bowls",
    price: 9.99,
    rating: 4.6,
    eta: 28,
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    tags: ["Budget", "Cheap & Tasty"],
  },
  {
    id: "bm-4",
    name: "Paneer Thali",
    restaurant: "Aai’s Kitchen",
    price: 12.5,
    rating: 4.5,
    eta: 30,
    image:
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80",
    tags: ["Under $15"],
  },
];

const BudgetMeal = () => {
  const [range, setRange] = useState<5 | 10 | 15>(10);
  const [sortBy, setSortBy] = useState<"price" | "rating" | "eta" | "popular">("price");
  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    window.location.hash = "#home";
  };

  const filtered = useMemo(() => {
    return BUDGET_ITEMS.filter((item) => item.price <= range);
  }, [range]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    switch (sortBy) {
      case "rating":
        return list.sort((a, b) => b.rating - a.rating);
      case "eta":
        return list.sort((a, b) => a.eta - b.eta);
      case "popular":
        return list;
      default:
        return list.sort((a, b) => a.price - b.price);
    }
  }, [filtered, sortBy]);

  return (
    <section className="section budget-meal">
      <div className="budget-meal__top">
        <button type="button" className="pill" onClick={handleBack}>
          Back
        </button>
        <h1>Affordable Meals Near You</h1>
        <p>Pick a budget range and find the best value meals quickly.</p>
        <div className="budget-meal__ranges">
          {[5, 10, 15].map((value) => (
            <button
              key={value}
              type="button"
              className={`pill ${range === value ? "active" : ""}`}
              onClick={() => setRange(value as 5 | 10 | 15)}
            >
              Under ${value}
            </button>
          ))}
        </div>
      </div>

      <div className="budget-meal__controls">
        <span>Sort by</span>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}>
          <option value="price">Lowest Price</option>
          <option value="rating">Best Rating</option>
          <option value="eta">Fastest Delivery</option>
          <option value="popular">Popular Cheap Items</option>
        </select>
      </div>

      <div className="budget-meal__list">
        {sorted.length === 0 ? (
          <div className="budget-meal__empty">
            No budget meals available nearby. Try increasing the price range.
          </div>
        ) : (
          sorted.map((item) => (
            <div key={item.id} className="budget-meal__card">
              <img src={item.image} alt={item.name} />
              <div className="budget-meal__body">
                <div className="budget-meal__row">
                  <strong>{item.name}</strong>
                  <span className="budget-meal__price">${item.price.toFixed(2)}</span>
                </div>
                <span className="budget-meal__restaurant">{item.restaurant}</span>
                <div className="budget-meal__meta">
                  <span>⭐ {item.rating.toFixed(1)}</span>
                  <span>{item.eta} mins</span>
                </div>
                <div className="budget-meal__tags">
                  {item.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default BudgetMeal;
