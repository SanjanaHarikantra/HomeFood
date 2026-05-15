import { useMemo, useState } from "react";
import "../styles/HealthyFood.css";

type HealthyDish = {
  id: string;
  name: string;
  restaurant: string;
  rating: number;
  price: number;
  calories: number;
  protein: number;
  carbs?: number;
  fat?: number;
  tags: string[];
  image: string;
  distanceKm: number;
};

const HEALTHY_DISHES: HealthyDish[] = [
  {
    id: "hf-1",
    name: "Green Power Bowl",
    restaurant: "Healthy Bowls",
    rating: 4.6,
    price: 9.5,
    calories: 350,
    protein: 22,
    carbs: 38,
    fat: 10,
    tags: ["Vegan", "Low Calorie"],
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    distanceKm: 1.4,
  },
  {
    id: "hf-2",
    name: "Grilled Chicken Plate",
    restaurant: "Protein Power Kitchen",
    rating: 4.7,
    price: 11.2,
    calories: 420,
    protein: 32,
    carbs: 20,
    fat: 12,
    tags: ["High Protein", "Gluten-Free"],
    image:
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=800&q=80",
    distanceKm: 2.1,
  },
  {
    id: "hf-3",
    name: "Millet Veg Bowl",
    restaurant: "Aai’s Kitchen",
    rating: 4.4,
    price: 8.75,
    calories: 390,
    protein: 16,
    carbs: 48,
    fat: 9,
    tags: ["Dairy-Free", "Low Oil"],
    image:
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80",
    distanceKm: 2.6,
  },
  {
    id: "hf-4",
    name: "Keto Salad Box",
    restaurant: "Fresh Greens",
    rating: 4.5,
    price: 10.0,
    calories: 310,
    protein: 18,
    carbs: 12,
    fat: 19,
    tags: ["Keto", "Low Carb"],
    image:
      "https://images.unsplash.com/photo-1543332164-6e82f355bad4?auto=format&fit=crop&w=800&q=80",
    distanceKm: 3.2,
  },
];

const FILTERS = [
  "Vegan",
  "Dairy-Free",
  "Gluten-Free",
  "High Protein",
  "Low Calorie",
  "Keto",
];

const HealthyFood = () => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"calories" | "protein" | "rating" | "distance">("calories");
  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    window.location.hash = "#home";
  };

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter) ? prev.filter((item) => item !== filter) : [...prev, filter]
    );
  };

  const filtered = useMemo(() => {
    if (selectedFilters.length === 0) return HEALTHY_DISHES;
    return HEALTHY_DISHES.filter((dish) =>
      selectedFilters.every((filter) => dish.tags.includes(filter))
    );
  }, [selectedFilters]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    switch (sortBy) {
      case "protein":
        return list.sort((a, b) => b.protein - a.protein);
      case "rating":
        return list.sort((a, b) => b.rating - a.rating);
      case "distance":
        return list.sort((a, b) => a.distanceKm - b.distanceKm);
      default:
        return list.sort((a, b) => a.calories - b.calories);
    }
  }, [filtered, sortBy]);

  return (
    <section className="section healthy-food">
      <div className="healthy-food__top">
        <button type="button" className="pill" onClick={handleBack}>
          Back
        </button>
        <h1>Healthy Choices Near You</h1>
        <p>Filter by diet and compare nutrition instantly.</p>
        <div className="healthy-food__filters">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              className={`pill ${selectedFilters.includes(filter) ? "active" : ""}`}
              onClick={() => toggleFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="healthy-food__sort">
        <span>Sort by</span>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}>
          <option value="calories">Lowest Calories</option>
          <option value="protein">Highest Protein</option>
          <option value="rating">Best Rated</option>
          <option value="distance">Nearest</option>
        </select>
      </div>

      <div className="healthy-food__list">
        {sorted.length === 0 ? (
          <div className="healthy-food__empty">
            No healthy meals found. Try removing filters or expanding radius.
          </div>
        ) : (
          sorted.map((dish) => (
            <div key={dish.id} className="healthy-food__card">
              <img src={dish.image} alt={dish.name} />
              <div className="healthy-food__body">
                <div className="healthy-food__row">
                  <strong>{dish.name}</strong>
                  <span className="healthy-food__price">₹{dish.price.toFixed(2)}</span>
                </div>
                <span className="healthy-food__restaurant">{dish.restaurant}</span>
                <div className="healthy-food__meta">
                  <span>⭐ {dish.rating.toFixed(1)}</span>
                  <span>{dish.distanceKm.toFixed(1)} km</span>
                </div>
                <div className="healthy-food__nutrition">
                  <span>{dish.calories} kcal</span>
                  <span>{dish.protein}g protein</span>
                  {dish.carbs !== undefined && <span>{dish.carbs}g carbs</span>}
                </div>
                <div className="healthy-food__tags">
                  {dish.tags.map((tag) => (
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

export default HealthyFood;
