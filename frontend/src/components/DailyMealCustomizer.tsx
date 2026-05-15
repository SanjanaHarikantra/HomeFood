import { FormEvent, useMemo, useState } from "react";
import "../styles/DailyMealCustomizer.css";

const mealOptions = [
  "Aai's Thali",
  "Protein Power Bowl",
  "Comfort Khichdi",
  "Millet Lunch Box",
  "South Indian Tiffin",
];

const deliverySlots = ["12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "7:30 PM"];

const extras = ["Curd", "Fruit Box", "Protein Juice", "Buttermilk", "Salad"];

const subscriptionPlans = [
  {
    id: "daily",
    title: "Daily Flex",
    description: "Best for office lunch and quick customization.",
    price: "₹1,499",
    cycle: "30 days",
    highlight: "Popular",
  },
  {
    id: "weekly",
    title: "Weekly Saver",
    description: "Perfect for weekday meal planning.",
    price: "₹499",
    cycle: "7 days",
    highlight: "Value",
  },
  {
    id: "monthly",
    title: "Monthly Premium",
    description: "For full meal planning with priority support.",
    price: "₹3,999",
    cycle: "30 days",
    highlight: "Premium",
  },
];

const DailyMealCustomizer = () => {
  const [day, setDay] = useState("Monday");
  const [meal, setMeal] = useState("");
  const [slot, setSlot] = useState("");
  const [spice, setSpice] = useState("Medium");
  const [portion, setPortion] = useState("Regular");
  const [note, setNote] = useState("");
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [openSelect, setOpenSelect] = useState<string | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState(subscriptionPlans[0]?.id ?? "daily");

  const [savedSnapshot, setSavedSnapshot] = useState<string>(() => {
    const raw = window.localStorage.getItem("customer_custom_plan");
    if (!raw) return "";
    try {
      const parsed = JSON.parse(raw) as { subscriptionPlan?: string };
      return parsed.subscriptionPlan ?? "";
    } catch {
      return "";
    }
  });

  const selectedPlan = subscriptionPlans.find((plan) => plan.id === selectedPlanId) ?? subscriptionPlans[0];

  const summary = useMemo(
    () => ({
      day,
      meal,
      slot,
      spice,
      portion,
      extras: selectedExtras.join(", ") || "None",
      note: note.trim() || "No note",
      plan: selectedPlan?.title ?? "No plan selected",
    }),
    [day, meal, slot, spice, portion, selectedExtras, note, selectedPlan]
  );

  const toggleExtra = (item: string) => {
    setSelectedExtras((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!meal) {
      setError("Please choose a meal.");
      setSuccess(false);
      return;
    }
    if (!slot) {
      setError("Please choose delivery slot.");
      setSuccess(false);
      return;
    }

    setError("");
    setSuccess(true);
    window.localStorage.setItem(
      "customer_custom_plan",
      JSON.stringify({
        day,
        meal,
        slot,
        spice,
        portion,
        extras: selectedExtras,
        note,
        subscriptionPlan: selectedPlan?.title ?? "",
      })
    );
    setSavedSnapshot(selectedPlan?.title ?? "");
  };

  const renderSelect = (
    id: string,
    label: string,
    value: string,
    options: string[],
    onChange: (next: string) => void,
    placeholder?: string
  ) => (
    <label className="daily-select" onClick={(event) => event.stopPropagation()}>
      {label}
      <button
        type="button"
        className="daily-select__trigger"
        aria-expanded={openSelect === id}
        onClick={() => setOpenSelect(openSelect === id ? null : id)}
      >
        <span>{value || placeholder || "Select"}</span>
        <span className="daily-select__chev">▾</span>
      </button>
      {openSelect === id && (
        <div className="daily-select__menu" role="listbox">
          {options.map((item) => (
            <button
              key={item}
              type="button"
              className={`daily-select__option ${item === value ? "active" : ""}`}
              onClick={() => {
                onChange(item);
                setOpenSelect(null);
              }}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </label>
  );

  return (
    <section className="daily-customizer premium-panel fade-in">
      <div className="daily-customizer__hero">
        <div className="daily-customizer__hero-copy">
          <span className="daily-customizer__eyebrow">Customer Studio</span>
          <h3>Custom meal planning and subscription in one place</h3>
          <p>
            Build your daily food preferences, add healthy extras, and attach a subscription
            plan that fits your routine.
          </p>
        </div>
        <div className="daily-customizer__hero-card">
          <span>Saved for {summary.day}</span>
          <strong>{summary.meal || "Choose your meal"}</strong>
          <small>{summary.plan}</small>
        </div>
      </div>

      <div className="daily-customizer__layout">
        <form className="daily-customizer__form" onSubmit={handleSubmit} noValidate>
          {renderSelect(
            "day",
            "Day",
            day,
            ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            setDay
          )}
          {renderSelect("meal", "Meal", meal, mealOptions, setMeal, "Select your meal")}
          {renderSelect("slot", "Delivery Slot", slot, deliverySlots, setSlot, "Select time")}
          {renderSelect("spice", "Spice Level", spice, ["Mild", "Medium", "Spicy"], setSpice)}
          {renderSelect("portion", "Portion", portion, ["Regular", "Large"], setPortion)}

          <label className="daily-customizer__note">
            Special Instructions
            <textarea
              rows={3}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="No onion / low oil / less salt"
            />
          </label>

          <div className="daily-customizer__extras">
            <p>Add Healthy Extras</p>
            <div className="daily-customizer__chips">
              {extras.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={selectedExtras.includes(item) ? "chip active" : "chip"}
                  onClick={() => toggleExtra(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="daily-customizer__plan-picker">
            <p>Attach a subscription plan</p>
            <div className="daily-customizer__plan-grid">
              {subscriptionPlans.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  className={`daily-customizer__plan-card ${selectedPlanId === plan.id ? "is-active" : ""}`}
                  onClick={() => setSelectedPlanId(plan.id)}
                >
                  <span>{plan.highlight}</span>
                  <strong>{plan.title}</strong>
                  <small>{plan.description}</small>
                  <em>
                    {plan.price} • {plan.cycle}
                  </em>
                </button>
              ))}
            </div>
          </div>

          {error && <p className="daily-customizer__error">{error}</p>}

          <div className="daily-customizer__actions">
            <button className="btn" type="submit">
              Save Daily Plan
            </button>
            <a className="btn btn-outline" href="#subscriptions">
              Browse Plans
            </a>
          </div>
        </form>

        <aside className="daily-customizer__summary-card">
          <h4>Your Premium Summary</h4>
          <span className="daily-customizer__snapshot">
            Saved Plan: {savedSnapshot || "No saved plan yet"}
          </span>
          <div className="daily-customizer__summary-lines">
            <p>Day: {summary.day}</p>
            <p>Meal: {summary.meal || "Select a meal"}</p>
            <p>Slot: {summary.slot || "Select a delivery slot"}</p>
            <p>Spice: {summary.spice}</p>
            <p>Portion: {summary.portion}</p>
            <p>Extras: {summary.extras}</p>
            <p>Plan: {summary.plan}</p>
            <p>Note: {summary.note}</p>
          </div>
        </aside>
      </div>

      {success && (
        <div className="daily-customizer__summary">
          <h4>Plan Saved</h4>
          <p>
            {summary.day} • {summary.meal} • {summary.slot}
          </p>
          <p>
            Spice: {summary.spice} • Portion: {summary.portion}
          </p>
          <p>Extras: {summary.extras}</p>
          <p>Subscription: {summary.plan}</p>
          <p>Note: {summary.note}</p>
        </div>
      )}
    </section>
  );
};

export default DailyMealCustomizer;
