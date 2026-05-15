import { useState } from "react";
import "../styles/Partner.css";

const Partner = () => {
  const [partnerId, setPartnerId] = useState("");
  const [partnerError, setPartnerError] = useState("");
  const [partnerSuccess, setPartnerSuccess] = useState("");

  const [demoData, setDemoData] = useState({
    company: "",
    city: "",
    teamSize: "",
    email: "",
    note: "",
  });
  const [demoError, setDemoError] = useState("");
  const [demoSuccess, setDemoSuccess] = useState("");

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handlePartnerContinue = () => {
    const value = partnerId.trim();
    if (!value) {
      setPartnerError("Please enter a kitchen ID or mobile number.");
      setPartnerSuccess("");
      return;
    }
    if (/^\d+$/.test(value) && !/^\d{10}$/.test(value)) {
      setPartnerError("Mobile number must be 10 digits.");
      setPartnerSuccess("");
      return;
    }
    if (!/^\d+$/.test(value) && value.length < 4) {
      setPartnerError("Kitchen ID should be at least 4 characters.");
      setPartnerSuccess("");
      return;
    }
    setPartnerError("");
    setPartnerSuccess("Thanks! We'll verify and take you to the next step.");
  };

  const handleDemoSubmit = () => {
    if (!demoData.company.trim() || demoData.company.trim().length < 2) {
      setDemoError("Please enter a valid company name.");
      setDemoSuccess("");
      return;
    }
    if (!demoData.city.trim() || demoData.city.trim().length < 2) {
      setDemoError("Please enter your city.");
      setDemoSuccess("");
      return;
    }
    if (!/^\d+$/.test(demoData.teamSize.trim()) || Number(demoData.teamSize) < 1) {
      setDemoError("Team size must be a positive number.");
      setDemoSuccess("");
      return;
    }
    if (!isValidEmail(demoData.email.trim())) {
      setDemoError("Enter a valid work email.");
      setDemoSuccess("");
      return;
    }
    setDemoError("");
    setDemoSuccess("Request received. We will contact you within 24 hours.");
  };

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="partner">
      <div className="partner__hero">
        <div className="partner__hero-content">
          <div className="partner__badge">Partner with DabbaWala</div>
          <h1>Reach customers far away from you</h1>
          <p>
            Expand your kitchen reach with scheduled dispatch, smart routing,
            and premium corporate meal programs.
          </p>
          <div className="partner__cta">
            <button className="btn" type="button" onClick={() => scrollToId("partner-get-started")}>
              Get Started
            </button>
            <button className="btn btn-outline" type="button" onClick={() => scrollToId("partner-demo")}>
              Talk to Us
            </button>
          </div>
        </div>

        <div className="partner__card" id="partner-get-started">
          <h3>Get Started</h3>
          <p>Enter a mobile number or kitchen ID to continue</p>
          <input
            type="text"
            placeholder="Enter Kitchen ID / Mobile number"
            value={partnerId}
            onChange={(event) => setPartnerId(event.target.value)}
          />
          {partnerError && <p className="form-error">{partnerError}</p>}
          {partnerSuccess && <p className="form-success">{partnerSuccess}</p>}
          <button className="btn" type="button" onClick={handlePartnerContinue}>
            Continue
          </button>
          <span className="partner__note">
            By logging in, you agree to our terms & conditions.
          </span>
        </div>
      </div>

      <div className="partner__body">
        <div className="partner__steps">
          <p className="partner__kicker">In just 3 easy steps</p>
          <h2>Get your kitchen delivery-ready in 24hrs!</h2>
          <ol>
            <li>
              <strong>Step 1</strong>
              <span className="partner__step-icon">📱</span>
              <span>Register your kitchen on the DabbaWala platform</span>
            </li>
            <li>
              <strong>Step 2</strong>
              <span className="partner__step-icon">🔐</span>
              <span>Login / Register using your phone number</span>
            </li>
            <li>
              <strong>Step 3</strong>
              <span className="partner__step-icon">🍱</span>
              <span>Enter kitchen details & menu</span>
            </li>
            <li>
              <strong>Step 4</strong>
              <span className="partner__step-icon">✅</span>
              <span>Kitchen verification & approval</span>
            </li>
          </ol>
        </div>

        <div className="partner__docs">
          <h3>Documents Required for Partner Registration</h3>
          <ul className="docs-list">
            <li>FSSAI License copy</li>
            <li>Your menu catalogue</li>
            <li>Bank details</li>
            <li>GSTIN</li>
            <li>PAN card copy</li>
          </ul>
        </div>
      </div>

      <div className="partner__benefits">
        <p className="partner__eyebrow">Partner Benefits</p>
        <div className="partner__stats">
          <div>
            <h3>98%</h3>
            <p>On-time delivery</p>
          </div>
          <div>
            <h3>500+</h3>
            <p>Corporate kitchens</p>
          </div>
          <div>
            <h3>24/7</h3>
            <p>Support line</p>
          </div>
        </div>
        <div className="partner__chips">
          <span>Dedicated Kitchen Teams</span>
          <span>Invoice & GST</span>
          <span>Custom Diet Plans</span>
        </div>
      </div>

      <div className="partner__earnings">
        <h2>Earn With DabbaWala</h2>
        <div className="partner__earnings-grid">
          <div>
            <h3>20 meals/day</h3>
            <p>₹18,000 / month</p>
          </div>
          <div>
            <h3>50 meals/day</h3>
            <p>₹45,000 / month</p>
          </div>
        </div>
      </div>

      <div className="partner__payments">
        <h2>Payments</h2>
        <ul className="partner__payments-list">
          <li>Weekly payout</li>
          <li>Direct bank transfer</li>
          <li>Order-based commission</li>
        </ul>
      </div>

      <div className="partner__promo">
        <div className="partner__info">
          <p className="partner__eyebrow">Partner With Us</p>
          <h2>Corporate Meals Program</h2>
          <p className="partner__sub">
            Build a premium meal program for your teams with fixed delivery
            windows, account support, and customizable menus.
          </p>
        </div>
      </div>

      <div className="partner__form" id="partner-demo">
        <h3>Request a Demo</h3>
        <p>Tell us about your office and we’ll reach out.</p>
        <div className="form-grid">
          <input
            type="text"
            placeholder="Company name"
            value={demoData.company}
            onChange={(event) => setDemoData((prev) => ({ ...prev, company: event.target.value }))}
          />
          <input
            type="text"
            placeholder="City"
            value={demoData.city}
            onChange={(event) => setDemoData((prev) => ({ ...prev, city: event.target.value }))}
          />
          <input
            type="text"
            placeholder="Team size"
            inputMode="numeric"
            value={demoData.teamSize}
            onChange={(event) =>
              setDemoData((prev) => ({ ...prev, teamSize: event.target.value.replace(/[^\d]/g, "") }))
            }
          />
          <input
            type="text"
            placeholder="Work email"
            value={demoData.email}
            onChange={(event) => setDemoData((prev) => ({ ...prev, email: event.target.value }))}
          />
        </div>
        <textarea
          rows={3}
          placeholder="Any special requirements?"
          value={demoData.note}
          onChange={(event) => setDemoData((prev) => ({ ...prev, note: event.target.value }))}
        />
        {demoError && <p className="form-error">{demoError}</p>}
        {demoSuccess && <p className="form-success">{demoSuccess}</p>}
        <button className="btn" type="button" onClick={handleDemoSubmit}>
          Submit Request
        </button>
        <span className="form-note">We respond within 24 hours.</span>
      </div>

      <div className="partner__faq">
        <h3>FAQ</h3>
        <div className="partner__faq-list">
          <div>How long does verification take?</div>
          <div>Can I pause partnership anytime?</div>
          <div>What are the delivery time windows?</div>
        </div>
      </div>
    </section>
  );
};

export default Partner;
