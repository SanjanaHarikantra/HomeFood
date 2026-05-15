import { useEffect, useMemo, useState } from "react";
import "../styles/EditProfile.css";
import {
  clearProfileStorage,
  getUserInitials,
  readNotificationSettings,
  readPaymentMethods,
  readProfileSettings,
  readSecuritySettings,
  type StoredPaymentMethod,
} from "../lib/profileStorage";
import type { BackendUser } from "../lib/backend";

type PasswordForm = {
  current: string;
  next: string;
  confirm: string;
};

type PaymentForm = {
  type: "card" | "upi";
  label: string;
  subtitle: string;
  number: string;
  holderName: string;
  expiryMonth: string;
  expiryYear: string;
  upiId: string;
  isDefault: boolean;
};

const EditProfile = () => {
  const storedUser = useMemo<BackendUser | null>(() => {
    const raw = window.localStorage.getItem("dabba_user");
    if (!raw) return null;
    try {
      return JSON.parse(raw) as BackendUser;
    } catch {
      return null;
    }
  }, []);

  const [profile, setProfile] = useState(() => readProfileSettings(storedUser));
  const [notifications, setNotifications] = useState(() => readNotificationSettings());
  const [paymentMethods, setPaymentMethods] = useState<StoredPaymentMethod[]>(() => readPaymentMethods());
  const [security, setSecurity] = useState(() => readSecuritySettings());
  const [profileMessage, setProfileMessage] = useState("");
  const [error, setError] = useState("");
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    current: "",
    next: "",
    confirm: "",
  });
  const [paymentForm, setPaymentForm] = useState<PaymentForm>({
    type: "card",
    label: "",
    subtitle: "Primary card",
    number: "",
    holderName: profile.displayName,
    expiryMonth: "",
    expiryYear: "",
    upiId: "",
    isDefault: paymentMethods.length === 0,
  });

  const navigateTo = (hash: string) => {
    window.location.hash = hash;
  };

  const scrollToSection = (id: string) => {
    const node = document.getElementById(id);
    if (node) {
      node.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    window.location.hash = `#${id}`;
  };

  useEffect(() => {
    window.localStorage.setItem("dabba_notification_settings", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    window.localStorage.setItem("dabba_payment_methods", JSON.stringify(paymentMethods));
  }, [paymentMethods]);

  useEffect(() => {
    setPaymentForm((prev) => ({
      ...prev,
      holderName: profile.displayName,
    }));
  }, [profile.displayName]);

  const persistUser = (nextProfile = profile) => {
    const nextUser = {
      ...storedUser,
      name: nextProfile.displayName,
      phone: nextProfile.phone,
    };
    window.localStorage.setItem("dabba_user", JSON.stringify(nextUser));
    window.dispatchEvent(new Event("dabba-user-updated"));
  };

  const handleSaveProfile = () => {
    const displayName = profile.displayName.trim();
    const phone = profile.phone.trim();
    const email = profile.email.trim();
    const city = profile.city.trim();

    if (!displayName || !phone || !email || !city) {
      setError("Please fill in name, phone, email, and city.");
      return;
    }

    if (!/^\d{10}$/.test(phone.replace(/[^\d]/g, ""))) {
      setError("Enter a valid 10-digit phone number.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }

    const nextProfile = {
      displayName,
      phone,
      email,
      city,
      initials: getUserInitials(displayName),
      updatedAt: new Date().toISOString(),
    };

    setProfile(nextProfile);
    window.localStorage.setItem("dabba_profile_settings", JSON.stringify(nextProfile));
    persistUser(nextProfile);
    setProfileMessage("Profile saved successfully.");
    setError("");
  };

  const handleCardSubmit = () => {
    if (paymentForm.type === "card") {
      const last4 = paymentForm.number.replace(/[^\d]/g, "").slice(-4);
      if (!paymentForm.label.trim() || !paymentForm.number.trim() || !paymentForm.holderName.trim() || !paymentForm.expiryMonth.trim() || !paymentForm.expiryYear.trim()) {
        setError("Fill all card details before saving.");
        return;
      }

      const nextCard: StoredPaymentMethod = {
        id: `card-${Date.now()}`,
        type: "card",
        label: paymentForm.label.trim(),
        subtitle: paymentForm.subtitle.trim() || "Primary card",
        last4,
        holderName: paymentForm.holderName.trim(),
        expiryMonth: paymentForm.expiryMonth.trim(),
        expiryYear: paymentForm.expiryYear.trim(),
        isDefault: paymentForm.isDefault || paymentMethods.length === 0,
      };

      setPaymentMethods((prev) => {
        const normalized = nextCard.isDefault ? prev.map((item) => ({ ...item, isDefault: false })) : prev;
        return [nextCard, ...normalized];
      });
      setPaymentForm({
        type: "card",
        label: "",
        subtitle: "Primary card",
        number: "",
        holderName: profile.displayName,
        expiryMonth: "",
        expiryYear: "",
        upiId: "",
        isDefault: false,
      });
      setError("");
      setProfileMessage("Payment method added.");
      return;
    }

    if (!paymentForm.upiId.trim()) {
      setError("Enter a UPI ID before saving.");
      return;
    }

    const nextUpi: StoredPaymentMethod = {
      id: `upi-${Date.now()}`,
      type: "upi",
      label: `UPI • ${paymentForm.upiId.trim()}`,
      subtitle: paymentForm.subtitle.trim() || "UPI payment",
      isDefault: paymentForm.isDefault || paymentMethods.length === 0,
    };

    setPaymentMethods((prev) => {
      const normalized = nextUpi.isDefault ? prev.map((item) => ({ ...item, isDefault: false })) : prev;
      return [nextUpi, ...normalized];
    });
    setPaymentForm({
      type: "upi",
      label: "",
      subtitle: "UPI payment",
      number: "",
      holderName: profile.displayName,
      expiryMonth: "",
      expiryYear: "",
      upiId: "",
      isDefault: false,
    });
    setError("");
    setProfileMessage("UPI method added.");
  };

  const setDefaultPaymentMethod = (id: string) => {
    setPaymentMethods((prev) => prev.map((item) => ({ ...item, isDefault: item.id === id })));
    setProfileMessage("Default payment method updated.");
  };

  const removePaymentMethod = (id: string) => {
    setPaymentMethods((prev) => {
      const next = prev.filter((item) => item.id !== id);
      if (next.length > 0 && !next.some((item) => item.isDefault)) {
        next[0] = { ...next[0], isDefault: true };
      }
      return next;
    });
    setProfileMessage("Payment method removed.");
  };

  const handleSavePassword = () => {
    if (!passwordForm.next.trim() || !passwordForm.confirm.trim()) {
      setError("Enter and confirm your new passcode.");
      return;
    }
    if (passwordForm.next !== passwordForm.confirm) {
      setError("New passcode and confirmation do not match.");
      return;
    }
    if (security.passcode && passwordForm.current !== security.passcode) {
      setError("Current passcode is incorrect.");
      return;
    }

    const nextSecurity = { passcode: passwordForm.next };
    setSecurity(nextSecurity);
    window.localStorage.setItem("dabba_security_settings", JSON.stringify(nextSecurity));
    setPasswordForm({ current: "", next: "", confirm: "" });
    setError("");
    setProfileMessage("Passcode updated for this device.");
  };

  const handleLogout = () => {
    window.localStorage.removeItem("dabba_user");
    window.dispatchEvent(new Event("dabba-user-updated"));
    window.location.hash = "#login";
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm("Delete your local account data from this device?");
    if (!confirmed) return;
    clearProfileStorage();
    window.localStorage.removeItem("dabba_user");
    window.localStorage.removeItem("dabba_entry_mode");
    window.dispatchEvent(new Event("dabba-user-updated"));
    window.location.hash = "#login";
  };

  const renderItem = (item: { icon: string; label: string; subtitle?: string; href?: string; tone?: "default" | "danger"; action?: () => void; }) => {
    const onClick = () => {
      if (item.href) {
        if (item.href.startsWith("#")) {
          navigateTo(item.href);
        } else {
          scrollToSection(item.href);
        }
        return;
      }
      item.action?.();
    };

    return (
      <button
        key={item.label}
        type="button"
        className={`profile-settings-item ${item.tone === "danger" ? "is-danger" : ""}`}
        onClick={onClick}
      >
        <span className="profile-settings-item__left">
          <span className="profile-settings-item__icon" aria-hidden="true">
            {item.icon}
          </span>
          <span className="profile-settings-item__text">
            <strong>{item.label}</strong>
            {item.subtitle && <small>{item.subtitle}</small>}
          </span>
        </span>
        <span className="profile-settings-item__arrow">›</span>
      </button>
    );
  };

  const accountItems = [
    { icon: "✏️", label: "Edit Profile", subtitle: "Name, phone, email", href: "profile-form" },
    { icon: "📞", label: "Change Phone / Email", subtitle: "Update contact details", href: "profile-form" },
    { icon: "📍", label: "Manage Addresses", subtitle: "Add address", href: "#addresses" },
  ];

  const paymentItems = [
    { icon: "💳", label: "Saved Cards", subtitle: "Add payment method", href: "payment-methods" },
    { icon: "💰", label: "UPI / Wallet", subtitle: "Add UPI ID", href: "payment-methods" },
    { icon: "🧾", label: "Transaction History", subtitle: "Open wallet history", href: "#wallet" },
  ];

  const securityItems = [
    { icon: "🔒", label: "Change Password", subtitle: "Local passcode on this device", href: "security-form" },
    { icon: "🚪", label: "Logout", subtitle: "Sign out of this device", action: handleLogout },
    { icon: "🗑️", label: "Delete Account", subtitle: "Clear local account data", tone: "danger" as const, action: handleDeleteAccount },
  ];

  const helpItems = [
    { icon: "🆘", label: "Help Center", subtitle: "Open support area", href: "#notifications" },
    { icon: "❓", label: "FAQs", subtitle: "Common questions", href: "#notifications" },
    { icon: "📞", label: "Contact Support", subtitle: "Reach the team", action: () => window.alert("Support: help@dabbawala.local") },
  ];

  return (
    <section className="edit-profile-page fade-in">
      <div className="edit-profile-header">
        <button className="profile-back" type="button" onClick={() => navigateTo("#profile")}>
          &lt;
        </button>
        <h1>Profile Settings</h1>
      </div>

      <section className="profile-header-card">
        <div className="profile-header-card__avatar">{profile.initials}</div>
        <div className="profile-header-card__info">
          <h2>{profile.displayName}</h2>
          <p>{profile.phone} • {profile.email}</p>
          <button type="button" onClick={() => scrollToSection("profile-form")}>✏️ Edit Profile</button>
        </div>
      </section>

      {profileMessage && <p className="profile-success">{profileMessage}</p>}
      {error && <p className="profile-error">{error}</p>}

      <section className="profile-settings-group" id="profile-form">
        <h3>👤 Profile Details</h3>
        <div className="profile-form-grid">
          <label className="profile-input">
            Name
            <input
              value={profile.displayName}
              onChange={(event) => setProfile((prev) => ({ ...prev, displayName: event.target.value }))}
              placeholder="Your name"
            />
          </label>
          <label className="profile-input">
            Phone
            <input
              value={profile.phone}
              onChange={(event) => setProfile((prev) => ({ ...prev, phone: event.target.value }))}
              placeholder="10-digit phone"
            />
          </label>
          <label className="profile-input">
            Email
            <input
              value={profile.email}
              onChange={(event) => setProfile((prev) => ({ ...prev, email: event.target.value }))}
              placeholder="Email address"
            />
          </label>
          <label className="profile-input">
            City
            <input
              value={profile.city}
              onChange={(event) => setProfile((prev) => ({ ...prev, city: event.target.value }))}
              placeholder="City"
            />
          </label>
        </div>
        <div className="profile-actions-row">
          <button type="button" className="profile-primary" onClick={handleSaveProfile}>
            Save Profile
          </button>
          <button type="button" className="profile-secondary" onClick={() => scrollToSection("payment-methods")}>
            Manage Payments
          </button>
        </div>
      </section>

      <section className="profile-settings-group">
        <h3>👤 Account Settings</h3>
        {accountItems.map(renderItem)}
      </section>

      <section className="profile-settings-group">
        <h3>🔔 Notifications</h3>
        <label className="profile-toggle-row">
          <span>
            <strong>Order updates</strong>
            <small>Realtime status alerts</small>
          </span>
          <input
            type="checkbox"
            checked={notifications.orderUpdates}
            onChange={(e) => setNotifications((prev) => ({ ...prev, orderUpdates: e.target.checked }))}
          />
        </label>
        <label className="profile-toggle-row">
          <span>
            <strong>Offers & promotions</strong>
            <small>Save more with smart deals</small>
          </span>
          <input
            type="checkbox"
            checked={notifications.offers}
            onChange={(e) => setNotifications((prev) => ({ ...prev, offers: e.target.checked }))}
          />
        </label>
        <label className="profile-toggle-row">
          <span>
            <strong>Push notifications</strong>
            <small>App level reminders</small>
          </span>
          <input
            type="checkbox"
            checked={notifications.push}
            onChange={(e) => setNotifications((prev) => ({ ...prev, push: e.target.checked }))}
          />
        </label>
      </section>

      <section className="profile-settings-group" id="payment-methods">
        <h3>💳 Payments & Wallet</h3>
        {paymentItems.map(renderItem)}

        <div className="profile-card-list">
          {paymentMethods.map((method) => (
            <div key={method.id} className={`profile-card-item ${method.isDefault ? "is-default" : ""}`}>
              <div>
                <strong>{method.label}</strong>
                <small>{method.subtitle}</small>
              </div>
              <div className="profile-card-actions">
                {!method.isDefault && (
                  <button type="button" onClick={() => setDefaultPaymentMethod(method.id)}>
                    Make default
                  </button>
                )}
                <button type="button" className="is-danger" onClick={() => removePaymentMethod(method.id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="profile-form-grid profile-form-grid--payment">
          <label className="profile-input">
            Method type
            <select
              value={paymentForm.type}
              onChange={(event) =>
                setPaymentForm((prev) => ({ ...prev, type: event.target.value as PaymentForm["type"] }))
              }
            >
              <option value="card">Card</option>
              <option value="upi">UPI</option>
            </select>
          </label>
          <label className="profile-input">
            Label
            <input
              value={paymentForm.label}
              onChange={(event) => setPaymentForm((prev) => ({ ...prev, label: event.target.value }))}
              placeholder={paymentForm.type === "card" ? "Visa ending 4242" : "UPI • sushmita@upi"}
            />
          </label>
          {paymentForm.type === "card" ? (
            <>
              <label className="profile-input">
                Card number
                <input
                  value={paymentForm.number}
                  onChange={(event) => setPaymentForm((prev) => ({ ...prev, number: event.target.value }))}
                  placeholder="4242 4242 4242 4242"
                />
              </label>
              <label className="profile-input">
                Holder name
                <input
                  value={paymentForm.holderName}
                  onChange={(event) => setPaymentForm((prev) => ({ ...prev, holderName: event.target.value }))}
                  placeholder="Card holder"
                />
              </label>
              <label className="profile-input">
                Expiry month
                <input
                  value={paymentForm.expiryMonth}
                  onChange={(event) => setPaymentForm((prev) => ({ ...prev, expiryMonth: event.target.value }))}
                  placeholder="08"
                />
              </label>
              <label className="profile-input">
                Expiry year
                <input
                  value={paymentForm.expiryYear}
                  onChange={(event) => setPaymentForm((prev) => ({ ...prev, expiryYear: event.target.value }))}
                  placeholder="28"
                />
              </label>
            </>
          ) : (
            <label className="profile-input profile-input--wide">
              UPI ID
              <input
                value={paymentForm.upiId}
                onChange={(event) => setPaymentForm((prev) => ({ ...prev, upiId: event.target.value }))}
                placeholder="name@upi"
              />
            </label>
          )}
          <label className="profile-toggle-row profile-toggle-row--compact">
            <span>
              <strong>Make default</strong>
              <small>Use this method at checkout</small>
            </span>
            <input
              type="checkbox"
              checked={paymentForm.isDefault}
              onChange={(event) => setPaymentForm((prev) => ({ ...prev, isDefault: event.target.checked }))}
            />
          </label>
        </div>
        <div className="profile-actions-row">
          <button type="button" className="profile-primary" onClick={handleCardSubmit}>
            Add Payment Method
          </button>
        </div>
      </section>

      <section className="profile-settings-group" id="security-form">
        <h3>🔒 Security</h3>
        {securityItems.map(renderItem)}
        <div className="profile-form-grid profile-form-grid--security">
          <label className="profile-input">
            Current passcode
            <input
              type="password"
              value={passwordForm.current}
              onChange={(event) => setPasswordForm((prev) => ({ ...prev, current: event.target.value }))}
              placeholder="Current passcode"
            />
          </label>
          <label className="profile-input">
            New passcode
            <input
              type="password"
              value={passwordForm.next}
              onChange={(event) => setPasswordForm((prev) => ({ ...prev, next: event.target.value }))}
              placeholder="New passcode"
            />
          </label>
          <label className="profile-input">
            Confirm passcode
            <input
              type="password"
              value={passwordForm.confirm}
              onChange={(event) => setPasswordForm((prev) => ({ ...prev, confirm: event.target.value }))}
              placeholder="Confirm passcode"
            />
          </label>
        </div>
        <div className="profile-actions-row">
          <button type="button" className="profile-primary" onClick={handleSavePassword}>
            Save Passcode
          </button>
          <button type="button" className="profile-secondary" onClick={handleLogout}>
            Logout Now
          </button>
        </div>
      </section>

      <section className="profile-settings-group">
        <h3>🆘 Help & Support</h3>
        {helpItems.map(renderItem)}
      </section>
    </section>
  );
};

export default EditProfile;
