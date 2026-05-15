import { FormEvent, useState } from "react";
import "../styles/HeroBanner.css";
import leaf from "../assets/images/leaf.png";

interface HeroBannerProps {
  onExplore?: () => void;
  onTrack?: () => void;
}

const HeroBanner = ({ onExplore, onTrack }: HeroBannerProps) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    window.location.hash = "#meals";
  };

  return (
    <section className="hero">
      <div className="hero-search-shell">
        <form className="hero-search-one" onSubmit={handleSearch}>
          <span className="search-icon">🔎</span>
          <input
            type="text"
            placeholder="Search for kitchen, meal, or feature"
            aria-label="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>
      </div>

      <div className="hero__content">
        <div className="hero__text fade-in">
          <h1>A Taste of Home, Anytime, Anywhere</h1>
          <p>
            Real home-cooked meals delivered in steel tiffins, warm, clean, and
            right on time. Taste nostalgia with every delivery.
          </p>
          <div className="hero__actions">
            <button className="btn" type="button" onClick={onExplore}>
              Explore Today’s Menu
            </button>
            <button className="btn btn-outline" type="button" onClick={onTrack}>
              Track My Tiffin
            </button>
          </div>
          <div className="hero__stats">
            <div>
              <h3>1200+</h3>
              <p className="muted">Meals Delivered Today</p>
            </div>
            <div>
              <h3>4.9★</h3>
              <p className="muted">Average Rating</p>
            </div>
            <div>
              <h3>30 min</h3>
              <p className="muted">Average Delivery</p>
            </div>
          </div>
        </div>

        <div className="hero__media fade-in">
          <div className="tiffin-card card">
            <img src={leaf} alt="Animated leaf" />
            <div className="tiffin-overlay" />
          </div>
          <div className="delivery-card card">
            <div className="scooter">🛵</div>
            <h4>Live delivery in motion</h4>
            <p className="muted">Animated tracking & smart reminders</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
