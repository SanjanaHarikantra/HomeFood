import "../styles/Open24Preview.css";

const Open24Preview = () => {
  const goToOpen24 = () => {
    window.location.hash = "#open-24-hours";
  };

  return (
    <section className="home-open-24" aria-label="Open 24 Hours">
      <div className="open-preview">
        <div className="open__header">
          <p className="open__eyebrow">Open 24 Hours</p>
          <h2>Open Now Near You</h2>
          <p>
            Real-time availability so late-night, early morning, and emergency
            hunger always find a match.
          </p>
        </div>

        <div className="open__controls">
          <div className="open__toggle" role="tablist" aria-label="Open status">
            <button className="toggle toggle--active" type="button" onClick={goToOpen24}>
              Open Now
            </button>
            <button className="toggle" type="button" onClick={goToOpen24}>
              24 Hours Only
            </button>
          </div>
          <div className="open__sort">
            <span>Sort:</span>
            <button className="sort-chip sort-chip--active" type="button" onClick={goToOpen24}>
              Nearest
            </button>
            <button className="sort-chip" type="button" onClick={goToOpen24}>
              Fastest Delivery
            </button>
            <button className="sort-chip" type="button" onClick={goToOpen24}>
              Top Rated
            </button>
            <button className="sort-chip" type="button" onClick={goToOpen24}>
              Popular
            </button>
          </div>
        </div>

        <div className="open__grid">
          <button className="open-card open-card--open" type="button" onClick={goToOpen24}>
            <div className="open-card__image open-card__image--noor">
              <span>24/7</span>
            </div>
            <div className="open-card__body">
              <div className="open-card__title">
                <h3>Noor Kitchen</h3>
                <span className="open-card__rating">⭐ 4.8</span>
              </div>
              <p>North Indian • Light Meals</p>
              <div className="open-card__meta">
                <span>0.8 km</span>
                <span>20-30 min</span>
              </div>
              <div className="open-card__status open-card__status--all">
                Open 24/7
              </div>
            </div>
          </button>

          <button className="open-card open-card--open" type="button" onClick={goToOpen24}>
            <div className="open-card__image open-card__image--midnight">
              <span>Open</span>
            </div>
            <div className="open-card__body">
              <div className="open-card__title">
                <h3>Midnight Momo Co.</h3>
                <span className="open-card__rating">⭐ 4.5</span>
              </div>
              <p>Steamed Snacks • Fast Bites</p>
              <div className="open-card__meta">
                <span>1.6 km</span>
                <span>25-35 min</span>
              </div>
              <div className="open-card__status open-card__status--open">
                Open Now • Closes at 3:00 AM
              </div>
            </div>
          </button>

          <button className="open-card open-card--soon" type="button" onClick={goToOpen24}>
            <div className="open-card__image open-card__image--dawn">
              <span>Soon</span>
            </div>
            <div className="open-card__body">
              <div className="open-card__title">
                <h3>Dawn Cafe</h3>
                <span className="open-card__rating">⭐ 4.3</span>
              </div>
              <p>Breakfast • Coffee</p>
              <div className="open-card__meta">
                <span>2.2 km</span>
                <span>15-20 min</span>
              </div>
              <div className="open-card__status open-card__status--soon">
                Closing Soon • 15 mins left
              </div>
            </div>
          </button>
        </div>

        <div className="open__insights">
          <div className="insight">
            <h4>Smart Alerts</h4>
            <p>Get nudges when a favorite spot is closing soon.</p>
            <span className="insight__pill">Closes in 15 mins</span>
          </div>
          <div className="insight">
            <h4>Late Night Mode</h4>
            <p>Prioritize cafes, fast food, and night kitchens after 10 PM.</p>
            <span className="insight__pill">Night kitchens</span>
          </div>
          <div className="insight insight--empty">
            <h4>No Restaurants Open?</h4>
            <p>Suggest scheduling or switching to another location.</p>
            <span className="insight__pill">Schedule order</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Open24Preview;
