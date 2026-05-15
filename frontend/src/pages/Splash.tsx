import "../styles/Splash.css";
import heroImage from "../assets/images/sp.png";

const Splash = () => {
  return (
    <section className="splash">
      <div className="splash__content">
        <div className="splash__stack">
          <div className="splash__ring" aria-hidden="true">
            <div className="splash__ring-inner">
              <img className="splash__hero" src={heroImage} alt="" />
            </div>
          </div>
        </div>
        <h1 className="splash__headline">
          Sush <span>Ahar</span>
        </h1>
        <p className="splash__subtitle">
          Experience the soulful taste of tradition.
          <span>Authentic, home-cooked meals crafted for the modern palate.</span>
        </p>
      </div>
    </section>
  );
};

export default Splash;
