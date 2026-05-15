import { useState } from "react";
import "../styles/MoreFilters.css";

const CUISINES = ["Indian", "Chinese", "Italian", "Fast Food", "Desserts"];
const PRICE = ["₹0 – ₹200", "₹200 – ₹500", "₹500+"];
const RATINGS = ["4.5+", "4.0+", "3.5+"];
const DISTANCE = ["Within 1 km", "Within 5 km", "Within 10 km"];
const DELIVERY = ["Under 20 mins", "Under 30 mins"];
const AVAILABILITY = ["Open now", "24 hours"];
const OFFERS = ["Free delivery", "Discounts", "Buy 1 Get 1"];
const DIET = ["Vegetarian", "Vegan", "Jain food", "Halal"];
const HEALTH = ["Low calorie", "High protein", "Keto"];
const SORT = ["Popular", "Rating", "Distance", "Price low → high"];

type FilterGroup =
  | "cuisine"
  | "price"
  | "rating"
  | "distance"
  | "delivery"
  | "availability"
  | "offers"
  | "diet"
  | "health"
  | "sort";

const groupMap: Record<FilterGroup, string[]> = {
  cuisine: CUISINES,
  price: PRICE,
  rating: RATINGS,
  distance: DISTANCE,
  delivery: DELIVERY,
  availability: AVAILABILITY,
  offers: OFFERS,
  diet: DIET,
  health: HEALTH,
  sort: SORT,
};

const MoreFilters = () => {
  const [selected, setSelected] = useState<Record<FilterGroup, string[]>>({
    cuisine: [],
    price: [],
    rating: [],
    distance: [],
    delivery: [],
    availability: [],
    offers: [],
    diet: [],
    health: [],
    sort: [],
  });

  const toggle = (group: FilterGroup, value: string) => {
    setSelected((prev) => {
      const has = prev[group].includes(value);
      const next = has ? prev[group].filter((v) => v !== value) : [...prev[group], value];
      return { ...prev, [group]: next };
    });
  };

  const resetAll = () => {
    setSelected({
      cuisine: [],
      price: [],
      rating: [],
      distance: [],
      delivery: [],
      availability: [],
      offers: [],
      diet: [],
      health: [],
      sort: [],
    });
  };
  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    window.location.hash = "#home";
  };

  const activeChips = Object.entries(selected).flatMap(([group, values]) =>
    values.map((value) => ({ group: group as FilterGroup, value }))
  );

  return (
    <section className="section more-filters">
      <div className="more-filters__header">
        <h2>Filters</h2>
        <div className="more-filters__actions">
          <button className="chip-btn chip-btn--ghost" type="button" onClick={handleBack}>
            Back
          </button>
          <button className="chip-btn chip-btn--ghost" type="button" onClick={resetAll}>
            Reset
          </button>
          <button className="chip-btn" type="button">
            Apply
          </button>
        </div>
      </div>

      {activeChips.length > 0 && (
        <div className="more-filters__chips">
          {activeChips.map((chip) => (
            <button
              key={`${chip.group}-${chip.value}`}
              type="button"
              className="chip"
              onClick={() => toggle(chip.group, chip.value)}
            >
              {chip.value} ✕
            </button>
          ))}
        </div>
      )}

      <div className="more-filters__group">
        <h3>Cuisine Type</h3>
        <div className="more-filters__options">
          {groupMap.cuisine.map((item) => (
            <label key={item} className="check">
              <input
                type="checkbox"
                checked={selected.cuisine.includes(item)}
                onChange={() => toggle("cuisine", item)}
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="more-filters__group">
        <h3>Price Range</h3>
        <div className="more-filters__options">
          {groupMap.price.map((item) => (
            <label key={item} className="check">
              <input
                type="checkbox"
                checked={selected.price.includes(item)}
                onChange={() => toggle("price", item)}
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="more-filters__group">
        <h3>Rating</h3>
        <div className="more-filters__options">
          {groupMap.rating.map((item) => (
            <label key={item} className="check">
              <input
                type="checkbox"
                checked={selected.rating.includes(item)}
                onChange={() => toggle("rating", item)}
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="more-filters__group">
        <h3>Distance</h3>
        <div className="more-filters__options">
          {groupMap.distance.map((item) => (
            <label key={item} className="check">
              <input
                type="checkbox"
                checked={selected.distance.includes(item)}
                onChange={() => toggle("distance", item)}
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="more-filters__group">
        <h3>Delivery Time</h3>
        <div className="more-filters__options">
          {groupMap.delivery.map((item) => (
            <label key={item} className="check">
              <input
                type="checkbox"
                checked={selected.delivery.includes(item)}
                onChange={() => toggle("delivery", item)}
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="more-filters__group">
        <h3>Availability</h3>
        <div className="more-filters__options">
          {groupMap.availability.map((item) => (
            <label key={item} className="check">
              <input
                type="checkbox"
                checked={selected.availability.includes(item)}
                onChange={() => toggle("availability", item)}
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="more-filters__group">
        <h3>Offers & Deals</h3>
        <div className="more-filters__options">
          {groupMap.offers.map((item) => (
            <label key={item} className="check">
              <input
                type="checkbox"
                checked={selected.offers.includes(item)}
                onChange={() => toggle("offers", item)}
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="more-filters__group">
        <h3>Dietary Preferences</h3>
        <div className="more-filters__options">
          {groupMap.diet.map((item) => (
            <label key={item} className="check">
              <input
                type="checkbox"
                checked={selected.diet.includes(item)}
                onChange={() => toggle("diet", item)}
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="more-filters__group">
        <h3>Health Filters</h3>
        <div className="more-filters__options">
          {groupMap.health.map((item) => (
            <label key={item} className="check">
              <input
                type="checkbox"
                checked={selected.health.includes(item)}
                onChange={() => toggle("health", item)}
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="more-filters__group">
        <h3>Sort By</h3>
        <div className="more-filters__options">
          {groupMap.sort.map((item) => (
            <label key={item} className="check">
              <input
                type="checkbox"
                checked={selected.sort.includes(item)}
                onChange={() => toggle("sort", item)}
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MoreFilters;
