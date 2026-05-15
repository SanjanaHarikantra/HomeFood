import { useMemo, useState } from "react";
import "../styles/Search.css";

type Suggestion = { type: "dish" | "kitchen" | "plan" | "recent"; label: string };

const SUGGESTIONS: Suggestion[] = [
  { type: "recent", label: "Paneer Millet Bowl" },
  { type: "recent", label: "Weekly Subscription" },
  { type: "dish", label: "Chicken Curry Tiffin" },
  { type: "dish", label: "Comfort Khichdi Combo" },
  { type: "kitchen", label: "Aai's Kitchen" },
  { type: "kitchen", label: "Noor Kitchen" },
  { type: "plan", label: "Daily Plan" },
  { type: "plan", label: "Monthly Plan" },
];

const DISHES = [
  {
    id: "dish-1",
    name: "Chicken Curry Tiffin",
    price: "Rs 249",
    image:
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80",
    rating: "4.7*",
  },
  {
    id: "dish-2",
    name: "Aai's Daily Thali",
    price: "Rs 169",
    image:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80",
    rating: "4.8*",
  },
  {
    id: "dish-3",
    name: "Protein Power Box",
    price: "Rs 219",
    image:
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=800&q=80",
    rating: "4.6*",
  },
];

const KITCHENS = [
  { id: "kitchen-1", name: "Aai's Kitchen", specialty: "Home-style North Indian" },
  { id: "kitchen-2", name: "Noor Kitchen", specialty: "Healthy bowls and salads" },
];

const PLANS = [
  { id: "plan-1", name: "Daily Plan", note: "Fresh meals every day" },
  { id: "plan-2", name: "Weekly Plan", note: "Meal packs for weekdays" },
  { id: "plan-3", name: "Monthly Plan", note: "Customized monthly menu" },
];

const Search = () => {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);

  const filteredSuggestions = useMemo(() => {
    if (!query.trim()) return SUGGESTIONS;
    return SUGGESTIONS.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <section className="search-page">
      <header className="search-header">
        <button className="search-back" type="button" onClick={() => window.history.back()}>
          Back
        </button>
        <div className="search-input">
          <input
            type="text"
            placeholder="Search for dishes, kitchens, or subscriptions..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => setShowSuggestions(true)}
          />
          <button className="search-mic" type="button" aria-label="Voice search">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19 11a7 7 0 0 1-14 0M12 18v3"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </header>

      {showSuggestions && (
        <section className="search-section">
          <div className="search-section__header">
            <h2>Suggestions</h2>
            <button className="search-clear" type="button" onClick={() => setShowSuggestions(false)}>
              Hide
            </button>
          </div>
          <div className="search-suggestions">
            {filteredSuggestions.map((item) => (
              <button key={`${item.type}-${item.label}`} className="search-chip" type="button">
                <span className={`search-chip__tag search-chip__tag--${item.type}`}>{item.type}</span>
                {item.label}
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="search-section">
        <div className="search-section__header">
          <h2>Filters</h2>
          <span className="search-muted">Premium filters</span>
        </div>
        <div className="search-filters">
          <button type="button" className="search-filter">Cuisine: Indian</button>
          <button type="button" className="search-filter">Meal: Lunch</button>
          <button type="button" className="search-filter">Price: Rs 150-Rs 300</button>
          <button type="button" className="search-filter">Delivery: Home</button>
        </div>
      </section>

      <section className="search-section">
        <div className="search-section__header">
          <h2>Recommended</h2>
          <span className="search-muted">Based on your history</span>
        </div>
        <div className="search-grid">
          {DISHES.map((dish) => (
            <article key={dish.id} className="search-card">
              <img src={dish.image} alt={dish.name} />
              <div className="search-card__body">
                <h3>{dish.name}</h3>
                <p>{dish.price}</p>
                <span className="search-badge">{dish.rating}</span>
                <button type="button" className="search-btn">Add to Cart</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="search-section">
        <div className="search-section__header">
          <h2>Top Kitchens</h2>
          <span className="search-muted">Most loved today</span>
        </div>
        <div className="search-list">
          {KITCHENS.map((kitchen) => (
            <div key={kitchen.id} className="search-list__item">
              <div>
                <h3>{kitchen.name}</h3>
                <p>{kitchen.specialty}</p>
              </div>
              <button type="button" className="search-btn search-btn--ghost">View</button>
            </div>
          ))}
        </div>
      </section>

      <section className="search-section">
        <div className="search-section__header">
          <h2>Subscription Plans</h2>
          <span className="search-muted">Daily / Weekly / Monthly</span>
        </div>
        <div className="search-list">
          {PLANS.map((plan) => (
            <div key={plan.id} className="search-list__item">
              <div>
                <h3>{plan.name}</h3>
                <p>{plan.note}</p>
              </div>
              <button type="button" className="search-btn search-btn--ghost">Explore</button>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
};

export default Search;
