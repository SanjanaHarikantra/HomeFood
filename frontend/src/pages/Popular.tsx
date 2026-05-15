import { useMemo, useState } from "react";
import "../styles/Popular.css";

type SortBy = "popular" | "rating" | "distance" | "eta";

type PopularRestaurant = {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  distanceKm: number;
  etaMin: number;
  recentOrders: number;
  userClicks: number;
  image: string;
};

const POPULAR_RESTAURANTS: PopularRestaurant[] = [
  {
    id: "pop-1",
    name: "Noor Kitchen",
    rating: 4.8,
    reviewCount: 1240,
    distanceKm: 0.8,
    etaMin: 24,
    recentOrders: 410,
    userClicks: 980,
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "pop-2",
    name: "Midnight Momo Co.",
    rating: 4.5,
    reviewCount: 860,
    distanceKm: 1.6,
    etaMin: 30,
    recentOrders: 520,
    userClicks: 1120,
    image:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "pop-3",
    name: "Healthy Bowls",
    rating: 4.6,
    reviewCount: 930,
    distanceKm: 2.1,
    etaMin: 28,
    recentOrders: 360,
    userClicks: 740,
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "pop-4",
    name: "Tiffin Express",
    rating: 4.7,
    reviewCount: 1520,
    distanceKm: 3.4,
    etaMin: 26,
    recentOrders: 450,
    userClicks: 890,
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc6c9?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "pop-5",
    name: "Dawn Cafe",
    rating: 4.3,
    reviewCount: 640,
    distanceKm: 1.2,
    etaMin: 20,
    recentOrders: 280,
    userClicks: 520,
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
  },
];

const popularityScore = (rest: PopularRestaurant) =>
  rest.recentOrders * 0.4 + rest.rating * 0.3 + rest.reviewCount * 0.2 + rest.userClicks * 0.1;

const badgeForRank = (rank: number) => {
  if (rank === 0) return "Hot";
  if (rank === 1) return "Trending";
  return "Popular";
};

const Popular = () => {
  const [sortBy, setSortBy] = useState<SortBy>("popular");
  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    window.location.hash = "#home";
  };

  const sorted = useMemo(() => {
    const list = [...POPULAR_RESTAURANTS];
    switch (sortBy) {
      case "rating":
        return list.sort((a, b) => b.rating - a.rating);
      case "distance":
        return list.sort((a, b) => a.distanceKm - b.distanceKm);
      case "eta":
        return list.sort((a, b) => a.etaMin - b.etaMin);
      default:
        return list.sort((a, b) => popularityScore(b) - popularityScore(a));
    }
  }, [sortBy]);

  return (
    <section className="section popular">
      <div className="popular__hero">
        <div>
          <button type="button" className="pill" onClick={handleBack}>
            Back
          </button>
          <h2>Popular Near You</h2>
          <p>Trending today · Most loved right now</p>
        </div>
        <div className="popular__sort">
          <span>Sort by</span>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortBy)}>
            <option value="popular">Popularity</option>
            <option value="rating">Rating</option>
            <option value="distance">Distance</option>
            <option value="eta">Delivery Time</option>
          </select>
        </div>
      </div>

      <div className="popular__list">
        {sorted.length === 0 ? (
          <div className="popular__empty">
            No trending restaurants right now. Try Best Sellers.
          </div>
        ) : (
          sorted.map((rest, index) => (
            <div key={rest.id} className="popular__card">
              <div className="popular__media">
                <img src={rest.image} alt={rest.name} />
                <span className="popular__badge">{badgeForRank(index)}</span>
              </div>
              <div className="popular__body">
                <div className="popular__row">
                  <h3>{rest.name}</h3>
                  <span className="popular__rating">⭐ {rest.rating}</span>
                </div>
                <div className="popular__meta">
                  <span>{rest.reviewCount.toLocaleString()} reviews</span>
                  <span>{rest.distanceKm.toFixed(1)} km</span>
                  <span>{rest.etaMin} min</span>
                </div>
                <div className="popular__proof">
                  {rest.recentOrders.toLocaleString()}+ orders this week
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default Popular;
