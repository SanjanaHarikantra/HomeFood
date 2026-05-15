import { useEffect, useState } from "react";
import "../styles/Navbar.css";
import logo from "../assets/images/sp.png";

interface NavbarProps {
  loggedIn: boolean;
}

const Navbar = ({ loggedIn }: NavbarProps) => {
  const [open, setOpen] = useState(false);
  const [activeRoute, setActiveRoute] = useState(window.location.hash || "#home");

  useEffect(() => {
    const onHashChange = () => setActiveRoute(window.location.hash || "#home");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return (
    <>
      <div className="mobile-topbar" aria-label="Mobile top bar">
        <div className="mobile-topbar__inner">
          <div className="mobile-topbar__left">
            <span className="mobile-topbar__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" role="img">
                <path
                  d="M12 2.8c-3.4 0-6.2 2.8-6.2 6.2 0 4.4 6.2 11 6.2 11s6.2-6.6 6.2-11c0-3.4-2.8-6.2-6.2-6.2Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <circle cx="12" cy="9" r="2.6" fill="currentColor" />
              </svg>
            </span>
            <div>
              <small>Your Location</small>
              <strong>San Francisco, CA</strong>
            </div>
          </div>
          <div className="mobile-topbar__right">
            <button
              className="mobile-topbar__action"
              type="button"
              aria-label="Notifications"
              onClick={() => {
                window.location.hash = "#notifications";
              }}
            >
              <svg className="mobile-topbar__action-icon" viewBox="0 0 24 24" fill="none" role="img">
                <path
                  d="M15 17h5l-1.4-1.4a2 2 0 0 1-.6-1.4V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5m6 0a3 3 0 1 1-6 0"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <a className="mobile-topbar__avatar" href="#profile" aria-label="Profile">
              S
            </a>
          </div>
        </div>
      </div>
      <header className="navbar">
        <div className="navbar__content">
          <div className="navbar__logo">
            <img className="logo-img" src={logo} alt="Sushahar logo" />
            <div className="logo-text">
              <span className="logo-top">Sushahar</span>
            </div>
          </div>
          <nav className={`navbar__links ${open ? "is-open" : ""}`}>
            <a href="#home">Home</a>
            <a href="#corporate"> Corporate </a>
            <a href="#customize-meal">Customize Meal</a>
            <a href="#subscriptions">Subscription</a>
            {/* <a href="#order-home-made-food">Homemade Food</a> */}
          </nav>
          <div className="navbar__actions">
            <div className="navbar__cta">
              <button
                className="navbar__btn navbar__btn--outline"
                type="button"
                onClick={() => {
                  window.location.hash = "#choose-role";
                }}
              >
                Get the App
              </button>
            </div>
            {!loggedIn && (
              <a className="navbar__login" href="#login">Sign in</a>
            )}
            {loggedIn && (
              <div className="profile-menu">
                <a className="icon-btn" aria-label="Profile" href="#profile">
                  <span className="icon-circle" aria-hidden="true">👤</span>
                </a>
              </div>
            )}
            <button
              className={`hamburger ${open ? "is-active" : ""}`}
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>
      <nav className="bottom-nav" aria-label="Primary">
        <a className={`bottom-nav__item ${activeRoute === "#home" ? "is-active" : ""}`} href="#home">
          <span className="bottom-nav__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M4 11.5L12 5l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5h-5v5H5a1 1 0 0 1-1-1v-7.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className="bottom-nav__label">Home</span>
        </a>
        <a className={`bottom-nav__item ${activeRoute === "#search" ? "is-active" : ""}`} href="#search">
          <span className="bottom-nav__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.7"/>
              <path d="M16 16l4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
            </svg>
          </span>
          <span className="bottom-nav__label">Search</span>
        </a>
        <a className={`bottom-nav__item ${activeRoute === "#customize-meal" ? "is-active" : ""}`} href="#customize-meal">
          <span className="bottom-nav__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M4 7h16M6 7V5.5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1V7M5.5 7h13v11a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1V7Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
              <path d="M9 11h2m2 0h2M9 14h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
            </svg>
          </span>
          <span className="bottom-nav__label">Customize</span>
        </a>
        <a className={`bottom-nav__item ${activeRoute === "#subscriptions" ? "is-active" : ""}`} href="#subscriptions">
          <span className="bottom-nav__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="m12 4 2.2 4.6 5 .7-3.6 3.5.9 4.9L12 15.9 7.5 17.7l.9-4.9L4.8 9.3l5-.7L12 4Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className="bottom-nav__label">Subscription</span>
        </a>
        <a className={`bottom-nav__item ${activeRoute === "#corporate" ? "is-active" : ""}`} href="#corporate">
          <span className="bottom-nav__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M4.5 19.5h15M6.5 19.5V5.5h11v14" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
              <path d="M9 9h2M13 9h2M9 12h2M13 12h2M9 15h2M13 15h2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
            </svg>
          </span>
          <span className="bottom-nav__label">Corporate</span>
        </a>
      </nav>
    </>
  );
};

export default Navbar;
