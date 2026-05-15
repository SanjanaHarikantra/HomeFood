import "../styles/Profile.css";
import profileImage from "../assets/images/logo.png";
import activityImage from "../assets/images/voice.jpg";
import { readPaymentMethods, readProfileSettings } from "../lib/profileStorage";
import type { BackendUser } from "../lib/backend";

const Profile = () => {
  const storedUser = (() => {
    const raw = window.localStorage.getItem("dabba_user");
    if (!raw) return null;
    try {
      return JSON.parse(raw) as BackendUser;
    } catch {
      return null;
    }
  })();
  const profile = readProfileSettings(storedUser);
  const paymentMethods = readPaymentMethods();
  const defaultMethod = paymentMethods.find((item) => item.isDefault) ?? paymentMethods[0] ?? null;

  const overviewItems = [
    { title: "My Orders", subtitle: "12 active, 105 done", icon: "OR" },
    { title: "GharKa Wallet", subtitle: "Open, Rs 450 balance", icon: "WL" },
    { title: "Favourites", subtitle: "28 meals saved", icon: "FV" },
    { title: "Manage Addresses", subtitle: "Saved delivery spots", icon: "AD" },
    { title: "Offers & Coupons", subtitle: "2 waiting", icon: "OF" },
    { title: "GharKa Gold", subtitle: "Explore benefits", icon: "GD" },
    { title: "Profile Settings", subtitle: "Privacy, notifications", icon: "ST" },
  ];

  const navigateTo = (hash: string) => {
    const target = hash.startsWith("#") ? hash : `#${hash}`;
    if (window.location.hash !== target) {
      window.history.pushState(null, "", target);
    }
    window.dispatchEvent(new Event("hashchange"));
  };

  const handleOverviewAction = (title: string) => {
    const routeByTitle: Record<string, string> = {
      "My Orders": "#order-history",
      "GharKa Wallet": "#wallet",
      Favourites: "#favourites",
      "Manage Addresses": "#addresses",
      "Offers & Coupons": "#offers",
      "GharKa Gold": "#gold",
      "Profile Settings": "#edit-profile",
    };

    const nextRoute = routeByTitle[title];
    if (nextRoute) {
      navigateTo(nextRoute);
      return;
    }

    window.alert("This section will be available soon.");
  };

  return (
    <section className="customer-profile">
      <header className="customer-profile__mini-header">
        <div>
          <h1>Home</h1>
          <p>Overview &amp; Analytics</p>
        </div>
        <div className="customer-profile__mini-actions">
          <button className="customer-profile__mini-icon" type="button" onClick={() => navigateTo("#edit-profile")}>
            {profile.initials}
          </button>
          <button
            className="customer-profile__mini-icon customer-profile__mini-icon--soft"
            type="button"
            aria-label="Notifications"
            onClick={() => navigateTo("#notifications")}
          >
            ◻
          </button>
        </div>
      </header>

      <section className="customer-profile__mini-hero">
        <div className="customer-profile__mini-hero-left">
          <div className="customer-profile__mini-avatar">{profile.initials}</div>
          <div>
            <div className="customer-profile__mini-name">{profile.displayName}</div>
            <div className="customer-profile__mini-meta">
              {profile.city} · {storedUser?.role ?? "Customer"}
            </div>
          </div>
        </div>
        <div className="customer-profile__mini-hero-actions">
          <button type="button" onClick={() => navigateTo("#edit-profile")}>Profile</button>
          <button type="button" onClick={() => navigateTo("#edit-profile")}>Settings</button>
        </div>
      </section>

      <div className="customer-profile__stats-strip">
        <div>
          <span>Total Savings</span>
          <strong>Rs 2,450</strong>
        </div>
        <div>
          <span>GharKa Wallet</span>
          <strong>Rs 450.00</strong>
        </div>
      </div>

      <main className="customer-profile__content">
        <section className="customer-profile__premium-banner">
          <img src={profileImage} alt="" aria-hidden="true" />
          <div>
            <strong>Premium Kitchen Access</strong>
            <p>Priority delivery, kitchen recommendations and curated weekly menus.</p>
          </div>
          <button type="button" onClick={() => navigateTo("#gold")}>
            Upgrade
          </button>
        </section>

        <section className="customer-profile__section">
          <h2>Account Overview</h2>
          <div className="customer-profile__grid">
            {overviewItems.map((item) => (
              <button
                key={item.title}
                className="customer-profile__tile"
                type="button"
                onClick={() => handleOverviewAction(item.title)}
              >
                <span className="customer-profile__tile-icon">{item.icon}</span>
                <div>
                  <strong>{item.title}</strong>
                  <small>{item.subtitle}</small>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="customer-profile__section">
          <div className="customer-profile__section-head">
            <h2>Primary Contact</h2>
            <button type="button" onClick={() => navigateTo("#edit-profile")}>
              Edit
            </button>
          </div>
          <article className="customer-profile__activity-card">
            <img
              src={activityImage}
              alt="Recent order thumbnail"
              className="customer-profile__activity-thumb"
            />
            <div>
              <strong>{profile.displayName}</strong>
              <small>{profile.phone}</small>
              <small>{profile.email}</small>
            </div>
            <button type="button" onClick={() => navigateTo("#edit-profile")}>Update</button>
          </article>
        </section>

        <section className="customer-profile__section">
          <div className="customer-profile__section-head">
            <h2>Default Payment</h2>
            <button type="button" onClick={() => navigateTo("#edit-profile")}>
              Manage
            </button>
          </div>
          <article className="customer-profile__activity-card">
            <img src={profileImage} alt="" className="customer-profile__activity-thumb" />
            <div>
              <strong>{defaultMethod?.label ?? "No payment method saved"}</strong>
              <small>{defaultMethod?.subtitle ?? "Add a card or UPI ID in settings"}</small>
            </div>
            <button type="button" onClick={() => navigateTo("#edit-profile")}>Open</button>
          </article>
        </section>

        <section className="customer-profile__referral">
          <div className="customer-profile__referral-icon">+</div>
          <div>
            <strong>Refer &amp; Earn</strong>
            <p>Get Rs100 for every friend who joins in.</p>
          </div>
          <button type="button" onClick={() => navigateTo("#refer-earn")}>
            Invite
          </button>
        </section>

        <section className="customer-profile__section">
          <div className="customer-profile__section-head">
            <h2>Recent Activity</h2>
            <button type="button" onClick={() => navigateTo("#order-history")}>
              View History
            </button>
          </div>
          <article className="customer-profile__activity-card">
            <img
              src={activityImage}
              alt="Recent order thumbnail"
              className="customer-profile__activity-thumb"
            />
            <div>
              <strong>La Pinoz Pizza</strong>
              <small>Delivered on Apr 6, 2026</small>
            </div>
            <button type="button" onClick={() => navigateTo("#meals")}>Reorder</button>
          </article>
        </section>

        <button
          className="customer-profile__logout"
          type="button"
          onClick={() => navigateTo("#login")}
        >
          Log out of your account
        </button>
      </main>
    </section>
  );
};

export default Profile;
