import { useEffect, useMemo, useState } from "react";
import "../styles/Open24Hours.css";

type OpenMode = "open" | "allDay";
type SortMode = "nearest" | "fastest" | "topRated" | "popular";

type Restaurant = {
  id: string;
  name: string;
  rating: number;
  distanceKm: number;
  etaMin: number;
  cuisine: string;
  image: string;
  openTime: string;
  closeTime: string;
  is24Hours: boolean;
  ordersToday: number;
};

const RESTAURANTS: Restaurant[] = [
  {
    id: "open-1",
    name: "Midnight Momo Co.",
    rating: 4.5,
    distanceKm: 1.6,
    etaMin: 30,
    cuisine: "Steamed Snacks",
    image:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80",
    openTime: "18:00",
    closeTime: "03:00",
    is24Hours: false,
    ordersToday: 124,
  },
  {
    id: "open-2",
    name: "Noor Kitchen",
    rating: 4.8,
    distanceKm: 0.8,
    etaMin: 24,
    cuisine: "North Indian",
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80",
    openTime: "00:00",
    closeTime: "00:00",
    is24Hours: true,
    ordersToday: 215,
  },
  {
    id: "open-3",
    name: "Dawn Cafe",
    rating: 4.3,
    distanceKm: 2.2,
    etaMin: 20,
    cuisine: "Breakfast",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    openTime: "05:30",
    closeTime: "13:30",
    is24Hours: false,
    ordersToday: 88,
  },
  {
    id: "open-4",
    name: "Night Owl Bowls",
    rating: 4.6,
    distanceKm: 1.1,
    etaMin: 26,
    cuisine: "Healthy Bowls",
    image:
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=800&q=80",
    openTime: "20:00",
    closeTime: "04:00",
    is24Hours: false,
    ordersToday: 147,
  },
  {
    id: "open-5",
    name: "All Day Tiffin",
    rating: 4.7,
    distanceKm: 3.0,
    etaMin: 35,
    cuisine: "Tiffin",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    openTime: "00:00",
    closeTime: "00:00",
    is24Hours: true,
    ordersToday: 201,
  },
];

const toMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const formatMinutes = (mins: number) => {
  const normalized = ((mins % 1440) + 1440) % 1440;
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHour}:${minutes.toString().padStart(2, "0")} ${period}`;
};

const isOpenNow = (now: number, rest: Restaurant) => {
  if (rest.is24Hours) return true;
  const open = toMinutes(rest.openTime);
  const close = toMinutes(rest.closeTime);
  if (open === close) return true;
  if (open < close) {
    return now >= open && now < close;
  }
  return now >= open || now < close;
};

const minutesUntilClose = (now: number, rest: Restaurant) => {
  if (rest.is24Hours) return null;
  const open = toMinutes(rest.openTime);
  const close = toMinutes(rest.closeTime);
  if (open < close) return close - now;
  if (now >= open) return 1440 - now + close;
  return close - now;
};

const sorters: Record<SortMode, (a: Restaurant, b: Restaurant) => number> = {
  nearest: (a, b) => a.distanceKm - b.distanceKm,
  fastest: (a, b) => a.etaMin - b.etaMin,
  topRated: (a, b) => b.rating - a.rating,
  popular: (a, b) => b.ordersToday - a.ordersToday,
};

const Open24Hours = () => {
  const [mode, setMode] = useState<OpenMode>("open");
  const [sortMode, setSortMode] = useState<SortMode>("nearest");
  const [nowMinutes, setNowMinutes] = useState(() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setNowMinutes(now.getHours() * 60 + now.getMinutes());
    };
    const id = window.setInterval(tick, 60 * 1000);
    tick();
    return () => window.clearInterval(id);
  }, []);

  const visibleRestaurants = useMemo(() => {
    const openNow = RESTAURANTS.filter((rest) => isOpenNow(nowMinutes, rest));
    const filtered = mode === "allDay" ? openNow.filter((rest) => rest.is24Hours) : openNow;
    return [...filtered].sort(sorters[sortMode]);
  }, [mode, nowMinutes, sortMode]);

  return (
    <section className="section open-24">
      <div className="open-24__hero">
        <div className="open-24__hero-card">
          <h2>Open 24 Hours</h2>
          <p>Restaurants open right now or 24/7.</p>
          <button
            type="button"
            className="open-24__back"
            onClick={() => {
              window.location.hash = "#home";
            }}
          >
            Back
          </button>
        </div>
      </div>

      <div className="open-24__header">
        <div>
          <h3>Open Now Near You</h3>
          <p>Live status based on current time.</p>
        </div>
        <div className="open-24__controls">
          <div className="open-24__toggle" role="tablist" aria-label="Open status">
            <button
              type="button"
              className={`open-24__tab ${mode === "open" ? "is-active" : ""}`}
              onClick={() => setMode("open")}
            >
              Open Now
            </button>
            <button
              type="button"
              className={`open-24__tab ${mode === "allDay" ? "is-active" : ""}`}
              onClick={() => setMode("allDay")}
            >
              24 Hours
            </button>
          </div>
          <div className="open-24__sort" role="tablist" aria-label="Sort restaurants">
            <span>Sort:</span>
            <button
              type="button"
              className={`open-24__chip ${sortMode === "nearest" ? "is-active" : ""}`}
              onClick={() => setSortMode("nearest")}
            >
              Nearest
            </button>
            <button
              type="button"
              className={`open-24__chip ${sortMode === "fastest" ? "is-active" : ""}`}
              onClick={() => setSortMode("fastest")}
            >
              Fastest
            </button>
            <button
              type="button"
              className={`open-24__chip ${sortMode === "topRated" ? "is-active" : ""}`}
              onClick={() => setSortMode("topRated")}
            >
              Top Rated
            </button>
            <button
              type="button"
              className={`open-24__chip ${sortMode === "popular" ? "is-active" : ""}`}
              onClick={() => setSortMode("popular")}
            >
              Popular
            </button>
          </div>
        </div>
      </div>

      <div className="open-24__list">
        {visibleRestaurants.length === 0 ? (
          <div className="open-24__empty">
            No restaurants open right now. Try switching modes or check back soon.
          </div>
        ) : (
          visibleRestaurants.map((rest) => {
            const closeIn = minutesUntilClose(nowMinutes, rest);
            const closingSoon = closeIn !== null && closeIn <= 30;
            const closeAt = rest.is24Hours ? null : formatMinutes(toMinutes(rest.closeTime));
            return (
              <div key={rest.id} className="open-24__card">
                <div className="open-24__media">
                  <img src={rest.image} alt={rest.name} />
                  {rest.is24Hours ? (
                    <span className="open-24__badge">24/7</span>
                  ) : (
                    <span className="open-24__badge">Open</span>
                  )}
                </div>
                <div className="open-24__body">
                  <div className="open-24__row">
                    <h4>{rest.name}</h4>
                    <span className="open-24__rating">⭐ {rest.rating}</span>
                  </div>
                  <p className="open-24__cuisine">{rest.cuisine}</p>
                  <div className="open-24__meta">
                    <span>{rest.distanceKm.toFixed(1)} km</span>
                    <span>{rest.etaMin} min</span>
                  </div>
                  <div
                    className={`open-24__status ${
                      rest.is24Hours ? "is-all" : closingSoon ? "is-soon" : "is-open"
                    }`}
                  >
                    {rest.is24Hours && "Open 24/7"}
                    {!rest.is24Hours && closingSoon && closeIn !== null
                      ? `Closing in ${closeIn} mins`
                      : null}
                    {!rest.is24Hours && !closingSoon && closeAt
                      ? `Open Now · Closes at ${closeAt}`
                      : null}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default Open24Hours;
