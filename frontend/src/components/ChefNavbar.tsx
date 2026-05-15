import { useEffect, useState } from "react";
import "../styles/ChefNavbar.css";
import logo from "../assets/images/sp.png";

interface ChefNavbarProps {
  onLogout?: () => void;
}

const ChefNavbar = ({ onLogout }: ChefNavbarProps) => {
  const [activeRoute, setActiveRoute] = useState(window.location.hash || "#chef-dashboard");

  useEffect(() => {
    const onHashChange = () => setActiveRoute(window.location.hash || "#chef-dashboard");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return (
    <header className="chef-navbar">
      <div className="chef-navbar__content">
        <div className="chef-navbar__brand">
          <img className="chef-navbar__logo" src={logo} alt="Sushahar logo" />
          <div className="chef-navbar__brand-text">
            <strong>Sushahar</strong>
            <span>Home Chef</span>
          </div>
        </div>

        <nav className="chef-navbar__tabs" aria-label="Chef navigation">
          <a
            className={`chef-navbar__tab ${activeRoute === "#chef-dashboard" ? "is-active" : ""}`}
            href="#chef-dashboard"
          >
            Home
          </a>
          <a
            className={`chef-navbar__tab ${activeRoute === "#chef-orders" ? "is-active" : ""}`}
            href="#chef-orders"
          >
            Orders
          </a>
          <a
            className={`chef-navbar__tab ${activeRoute === "#chef-menu" ? "is-active" : ""}`}
            href="#chef-menu"
          >
            Menu
          </a>
          <a
            className={`chef-navbar__tab ${activeRoute === "#chef-nearby" ? "is-active" : ""}`}
            href="#chef-nearby"
          >
            Nearby
          </a>
          <a
            className={`chef-navbar__tab ${activeRoute === "#chef-profile" ? "is-active" : ""}`}
            href="#chef-profile"
          >
            Profile
          </a>
        </nav>

        <div className="chef-navbar__actions">
          <button
            type="button"
            className="chef-navbar__logout"
            onClick={() => {
              if (onLogout) onLogout();
              window.location.hash = "#choose-role";
            }}
          >
            Exit Chef Mode
          </button>
        </div>
      </div>
    </header>
  );
};

export default ChefNavbar;
