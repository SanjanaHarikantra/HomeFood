import { useMemo, useState } from "react";
import "../styles/Location.css";

interface LocationProps {
  location: string;
  onSave: (value: string) => void;
}

const SUGGESTIONS = [
  "Andheri West, Mumbai",
  "Bandra East, Mumbai",
  "Powai, Mumbai",
  "Koregaon Park, Pune",
  "Hinjewadi, Pune",
  "Indiranagar, Bengaluru",
  "Koramangala, Bengaluru",
  "T. Nagar, Chennai",
  "Banjara Hills, Hyderabad",
  "Park Street, Kolkata",
  "Connaught Place, Delhi",
  "Gurugram Sector 29",
  "Noida Sector 62",
];

const Location = ({ location, onSave }: LocationProps) => {
  const [value, setValue] = useState(location);
  const [error, setError] = useState("");
  const [locating, setLocating] = useState(false);

  const matches = useMemo(() => {
    const query = value.trim().toLowerCase();
    if (!query) return [];
    return SUGGESTIONS.filter((item) => item.toLowerCase().includes(query)).slice(0, 5);
  }, [value]);

  const handleSave = () => {
    if (!value.trim()) {
      setError("Please enter your delivery location.");
      return;
    }
    if (value.trim().length < 3) {
      setError("Location should be at least 3 characters.");
      return;
    }
    setError("");
    onSave(value.trim());
  };

  const handlePrecise = (autoSave?: boolean) => {
    if (!window.isSecureContext) {
      setError("Precise location requires HTTPS or localhost.");
      return;
    }
    if (!navigator.geolocation) {
      setError("Geolocation is not supported in this browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const nextValue = `Lat ${latitude.toFixed(4)}, Lng ${longitude.toFixed(4)}`;
        setValue(nextValue);
        setError("");
        setLocating(false);
        if (autoSave) {
          onSave(nextValue);
        }
      },
      () => {
        setError("Unable to fetch your location. Please allow permission.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleExploreNearby = () => {
    handlePrecise(true);
  };

  return (
    <section className="location">
      <div className="location__card">
        <div className="location__top">
          <div className="location__icon">📍</div>
          <button className="location__ghost" type="button" onClick={handleExploreNearby}>
            Explore Nearby
          </button>
        </div>

        <div className="location__text">
          <h2>
            Where are you
            <span>Hungry?</span>
          </h2>
          <p>
            Enter your address to discover local favorites and get real-time
            delivery updates.
          </p>
        </div>

        <div className="location__search">
          <span className="location__search-icon">📍</span>
          <input
            type="text"
            placeholder="Search city, area or street..."
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
          {matches.length > 0 && (
            <div className="location__dropdown" role="listbox">
              {matches.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="location__option"
                  onClick={() => setValue(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>

        <button className="location__precise" type="button" onClick={() => handlePrecise(false)}>
          ▲ {locating ? "Locating..." : "Use precise location"}
        </button>

        {error && <p className="location__error">{error}</p>}

        <button className="location__cta" type="button" onClick={handleSave}>
          Find Food <span>›</span>
        </button>
      </div>
    </section>
  );
};

export default Location;
