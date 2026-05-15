import "../styles/Corporate.css";

const Corporate = () => {
  return (
    <section className="corporate">
      <div className="corporate__hero">
        <div className="corporate__hero-inner">
          <p className="corporate__eyebrow">DabbaWala Corporate</p>
          <h1>About Us</h1>
          <p className="corporate__sub">
            We deliver dependable, homestyle meals for teams and offices — warm,
            nutritious, and on time.
          </p>
          <div className="corporate__hero-art">
            <div className="art-card">
              <span className="art-emoji">🛵</span>
              <div>
                <h4>Fast Dispatch</h4>
                <p>Smart routes & live updates.</p>
              </div>
            </div>
            <div className="art-card">
              <span className="art-emoji">🥗</span>
              <div>
                <h4>Healthy Choices</h4>
                <p>Balanced meals, fresh daily.</p>
              </div>
            </div>
            <div className="art-card">
              <span className="art-emoji">🏢</span>
              <div>
                <h4>Office Ready</h4>
                <p>On-time for every shift.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="corporate__section">
        <div className="corporate__cards">
          <div className="corporate__card">
            <div className="illust illust--delivery">
              <div className="illust__bubble">Delivery</div>
              <div className="illust__icon">🛵</div>
            </div>
            <h3>Corporate Meals</h3>
            <p>Daily lunch programs with curated regional menus.</p>
          </div>
          <div className="corporate__card">
            <div className="illust illust--tiffin">
              <div className="illust__bubble">Tiffin</div>
              <div className="illust__icon">🍱</div>
            </div>
            <h3>On-time Delivery</h3>
            <p>Batch routing for punctual, scalable delivery.</p>
          </div>
          <div className="corporate__card">
            <div className="illust illust--healthy">
              <div className="illust__bubble">Healthy</div>
              <div className="illust__icon">🥦</div>
            </div>
            <h3>Healthy Menus</h3>
            <p>Balanced macros, low-oil options, and diet plans.</p>
          </div>
        </div>
      </div>

      <div className="corporate__map">
        <div className="corporate__map-overlay">
          <h2>Delivering For Everyone</h2>
          <p>
            120+ corporate hubs • 4,500+ daily tiffins • 24/7 support
          </p>
          <div className="corporate__pills">
            <span>Bulk Orders</span>
            <span>Team Subscriptions</span>
            <span>Custom Menus</span>
          </div>
          <div className="map-icons">
            <div className="map-pin">📍</div>
            <div className="map-pin">🍛</div>
            <div className="map-pin">🧑‍🍳</div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Corporate;
