import { useMemo, useState } from "react";
import "../styles/NearMe.css";

type Restaurant = {
  id: string;
  name: string;
  rating: number;
  eta: number;
  priceLevel: "$" | "$$" | "$$$";
  tags: string[];
  image: string;
  lat: number;
  lng: number;
  open: boolean;
};

const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: "rest-1",
    name: "Aai’s Kitchen",
    rating: 4.7,
    eta: 24,
    priceLevel: "$$",
    tags: ["Free delivery", "Popular"],
    image:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80",
    lat: 28.6165,
    lng: 77.3491,
    open: true,
  },
  {
    id: "rest-2",
    name: "Millet Bowl Co.",
    rating: 4.5,
    eta: 30,
    priceLevel: "$",
    tags: ["Healthy", "Discount available"],
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    lat: 28.6202,
    lng: 77.3384,
    open: true,
  },
  {
    id: "rest-3",
    name: "Biryani Junction",
    rating: 4.2,
    eta: 35,
    priceLevel: "$$",
    tags: ["Popular"],
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80",
    lat: 28.6282,
    lng: 77.3601,
    open: false,
  },
  {
    id: "rest-4",
    name: "Protein Power Kitchen",
    rating: 4.6,
    eta: 28,
    priceLevel: "$$$",
    tags: ["Free delivery", "Premium"],
    image:
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=800&q=80",
    lat: 28.6058,
    lng: 77.3419,
    open: true,
  },
];

const toRad = (value: number) => (value * Math.PI) / 180;

const distanceKm = (aLat: number, aLng: number, bLat: number, bLng: number) => {
  const earthRadius = 6371;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const lat1 = toRad(aLat);
  const lat2 = toRad(bLat);
  const calc =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return earthRadius * 2 * Math.atan2(Math.sqrt(calc), Math.sqrt(1 - calc));
};

const NearMe = () => {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [permission, setPermission] = useState<"unknown" | "granted" | "denied">("unknown");
  const [radiusKm, setRadiusKm] = useState(5);
  const [minRating, setMinRating] = useState(0);
  const [openNow, setOpenNow] = useState(false);
  const [sortBy, setSortBy] = useState<"distance" | "rating" | "eta" | "popular">("distance");
  const [view, setView] = useState<"list" | "map">("list");
  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    window.location.hash = "#home";
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setPermission("denied");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPermission("granted");
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        setPermission("denied");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const enriched = useMemo(() => {
    if (!location) {
      return [];
    }
    return MOCK_RESTAURANTS.map((rest) => ({
      ...rest,
      distance: distanceKm(location.lat, location.lng, rest.lat, rest.lng),
    }));
  }, [location]);

  const filtered = useMemo(() => {
    const lower = query.trim().toLowerCase();
    return enriched
      .filter((rest) => rest.distance <= radiusKm)
      .filter((rest) => (minRating ? rest.rating >= minRating : true))
      .filter((rest) => (openNow ? rest.open : true))
      .filter((rest) => (lower ? rest.name.toLowerCase().includes(lower) : true));
  }, [enriched, minRating, openNow, query, radiusKm]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    switch (sortBy) {
      case "rating":
        return list.sort((a, b) => b.rating - a.rating);
      case "eta":
        return list.sort((a, b) => a.eta - b.eta);
      case "popular":
        return list.sort((a, b) => b.tags.length - a.tags.length);
      default:
        return list.sort((a, b) => a.distance - b.distance);
    }
  }, [filtered, sortBy]);

  return (
    <section className="section near-me">
      <div className="near-me__top">
        <button type="button" className="pill" onClick={handleBack}>
          Back
        </button>
        <h1>Near Me</h1>
        <p>Search nearby restaurants or dishes</p>
        <div className="near-me__search">
          <span>🔎</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search nearby restaurants or dishes"
          />
        </div>
        <div className="near-me__location">
          <span>Delivering to: {permission === "granted" ? "Current Location" : "Unknown"}</span>
          <div className="near-me__location-actions">
            <button className="btn" type="button" onClick={requestLocation}>
              {permission === "granted" ? "Refresh Location" : "Use GPS Location"}
            </button>
          </div>
        </div>
      </div>

      <div className="near-me__toggle">
        <button
          type="button"
          className={`pill ${view === "list" ? "active" : ""}`}
          onClick={() => setView("list")}
        >
          List View
        </button>
        <button
          type="button"
          className={`pill ${view === "map" ? "active" : ""}`}
          onClick={() => setView("map")}
        >
          Map View
        </button>
      </div>

      <div className="near-me__filters">
        <label>
          Distance
          <select value={radiusKm} onChange={(e) => setRadiusKm(Number(e.target.value))}>
            <option value={2}>Under 2 km</option>
            <option value={5}>Under 5 km</option>
            <option value={10}>Under 10 km</option>
          </select>
        </label>
        <label>
          Rating
          <select value={minRating} onChange={(e) => setMinRating(Number(e.target.value))}>
            <option value={0}>Any</option>
            <option value={4}>4★ and above</option>
            <option value={4.5}>4.5★ and above</option>
          </select>
        </label>
        <label>
          Open Now
          <input
            type="checkbox"
            checked={openNow}
            onChange={(e) => setOpenNow(e.target.checked)}
          />
        </label>
      </div>

      <div className="near-me__sort">
        <span>Sort by</span>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}>
          <option value="distance">Distance</option>
          <option value="rating">Rating</option>
          <option value="eta">Delivery Time</option>
          <option value="popular">Popularity</option>
        </select>
      </div>

      {permission === "denied" && (
        <div className="near-me__notice">
          Location permission denied. Enable GPS to see nearby restaurants.
        </div>
      )}

      {view === "map" ? (
        <div className="near-me__map">Map view placeholder (pins)</div>
      ) : (
        <div className="near-me__list">
          {permission !== "granted" && (
            <div className="near-me__empty">
              Enable location to see nearby restaurants.
            </div>
          )}
          {permission === "granted" && sorted.length === 0 && (
            <div className="near-me__empty">
              No restaurants found nearby. Try increasing the radius or changing filters.
            </div>
          )}
          {permission === "granted" &&
            sorted.map((rest) => (
              <div key={rest.id} className={`near-me__card ${rest.open ? "" : "is-closed"}`}>
                <img src={rest.image} alt={rest.name} />
                <div className="near-me__card-body">
                  <div className="near-me__card-head">
                    <h3>{rest.name}</h3>
                    <span className="near-me__rating">⭐ {rest.rating.toFixed(1)}</span>
                  </div>
                  <div className="near-me__meta">
                    <span>{rest.distance.toFixed(1)} km away</span>
                    <span>{rest.eta} mins</span>
                    <span>{rest.priceLevel}</span>
                  </div>
                  <div className="near-me__tags">
                    {rest.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                    <span className={rest.open ? "open" : "closed"}>
                      {rest.open ? "Open now" : "Closed"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </section>
  );
};

export default NearMe;
