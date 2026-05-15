import { useMemo, useState } from "react";
import "../styles/BigPromo.css";

type PromoType = "percent" | "flat" | "free_delivery" | "bogo";

type PromoRestaurant = {
  id: string;
  name: string;
  rating: number;
  eta: number;
  priceLevel: "$" | "$$" | "$$$";
  image: string;
  promoLabel: string;
  promoType: PromoType;
  discountValue?: number;
  minOrder?: number;
  maxCap?: number;
  validTill?: string;
  popularity: number;
};

const PROMO_RESTAURANTS: PromoRestaurant[] = [
  {
    id: "promo-1",
    name: "Burger Craft",
    rating: 4.6,
    eta: 22,
    priceLevel: "$$",
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
    promoLabel: "50% OFF",
    promoType: "percent",
    discountValue: 50,
    minOrder: 15,
    maxCap: 10,
    validTill: "Tonight",
    popularity: 92,
  },
  {
    id: "promo-2",
    name: "Biryani Junction",
    rating: 4.3,
    eta: 30,
    priceLevel: "$$",
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80",
    promoLabel: "Buy 1 Get 1",
    promoType: "bogo",
    validTill: "Midnight",
    popularity: 88,
  },
  {
    id: "promo-3",
    name: "Healthy Bowls",
    rating: 4.5,
    eta: 28,
    priceLevel: "$",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    promoLabel: "Free Delivery",
    promoType: "free_delivery",
    validTill: "Weekend",
    popularity: 80,
  },
  {
    id: "promo-4",
    name: "Tiffin Express",
    rating: 4.7,
    eta: 24,
    priceLevel: "$$",
    image:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80",
    promoLabel: "Flat $5 OFF",
    promoType: "flat",
    discountValue: 5,
    minOrder: 20,
    validTill: "Today",
    popularity: 95,
  },
];

const PROMO_BANNERS = [
  { title: "50% OFF Today", subtitle: "Ends in 2h 15m" },
  { title: "Free Delivery Weekend", subtitle: "Only for top picks" },
  { title: "BOGO Specials", subtitle: "Limited time deals" },
];

const BigPromo = () => {
  const [sortBy, setSortBy] = useState<"discount" | "nearest" | "fastest" | "popular">("discount");
  const [filter, setFilter] = useState<"all" | "50plus" | "free" | "bogo">("all");
  const [selected, setSelected] = useState<PromoRestaurant | null>(null);
  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    window.location.hash = "#home";
  };

  const filtered = useMemo(() => {
    return PROMO_RESTAURANTS.filter((rest) => {
      if (filter === "50plus") return rest.promoType === "percent" && (rest.discountValue ?? 0) >= 50;
      if (filter === "free") return rest.promoType === "free_delivery";
      if (filter === "bogo") return rest.promoType === "bogo";
      return true;
    });
  }, [filter]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    switch (sortBy) {
      case "fastest":
        return list.sort((a, b) => a.eta - b.eta);
      case "popular":
        return list.sort((a, b) => b.popularity - a.popularity);
      case "nearest":
        return list;
      default:
        return list.sort((a, b) => (b.discountValue ?? 0) - (a.discountValue ?? 0));
    }
  }, [filtered, sortBy]);

  return (
    <section className="section big-promo">
      <div className="big-promo__hero">
        <div className="big-promo__hero-card">
          <h2>Open 24 Hours</h2>
          <p>Restaurants open right now or 24/7.</p>
          <button type="button" className="big-promo__hero-btn" onClick={handleBack}>
            Back
          </button>
        </div>
      </div>

      <div className="big-promo__banner">
        {PROMO_BANNERS.map((banner) => (
          <div key={banner.title} className="big-promo__slide">
            <span className="big-promo__badge">Limited Time</span>
            <h2>{banner.title}</h2>
            <p>{banner.subtitle}</p>
          </div>
        ))}
      </div>

      <div className="big-promo__controls">
        <div className="big-promo__filters">
          {[
            { value: "all", label: "All Promos" },
            { value: "50plus", label: "50%+ Only" },
            { value: "free", label: "Free Delivery" },
            { value: "bogo", label: "BOGO" },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              className={`pill ${filter === item.value ? "active" : ""}`}
              onClick={() => setFilter(item.value as typeof filter)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="big-promo__sort">
          <span>Sort by</span>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}>
            <option value="discount">Highest Discount</option>
            <option value="nearest">Nearest</option>
            <option value="fastest">Fastest Delivery</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>

      <div className="big-promo__list">
        {sorted.length === 0 ? (
          <div className="big-promo__empty">
            No promos right now. Try Popular or Near Me.
          </div>
        ) : (
          sorted.map((rest) => (
            <button
              key={rest.id}
              type="button"
              className="big-promo__card"
              onClick={() => setSelected(rest)}
            >
              <div className="big-promo__media">
                <img src={rest.image} alt={rest.name} />
                <span className="big-promo__tag">{rest.promoLabel}</span>
              </div>
              <div className="big-promo__body">
                <div className="big-promo__row">
                  <strong>{rest.name}</strong>
                  <span className="big-promo__rating">⭐ {rest.rating}</span>
                </div>
                <div className="big-promo__meta">
                  <span>{rest.eta} mins</span>
                  <span>{rest.priceLevel}</span>
                </div>
                <div className="big-promo__terms">
                  {rest.promoType === "percent" && (
                    <span>
                      {rest.discountValue}% OFF up to ${rest.maxCap} on ${rest.minOrder}+
                    </span>
                  )}
                  {rest.promoType === "flat" && (
                    <span>${rest.discountValue} OFF on ${rest.minOrder}+</span>
                  )}
                  {rest.promoType === "free_delivery" && <span>Free delivery</span>}
                  {rest.promoType === "bogo" && <span>Buy 1 Get 1</span>}
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {selected && (
        <div className="big-promo__modal">
          <div className="big-promo__modal-card">
            <h3>{selected.name}</h3>
            <p className="big-promo__modal-offer">{selected.promoLabel}</p>
            <p>
              {selected.promoType === "percent" &&
                `${selected.discountValue}% OFF up to $${selected.maxCap} on orders above $${selected.minOrder}.`}
              {selected.promoType === "flat" &&
                `$${selected.discountValue} OFF on orders above $${selected.minOrder}.`}
              {selected.promoType === "free_delivery" && "Free delivery on all orders."}
              {selected.promoType === "bogo" && "Buy one get one free on select items."}
            </p>
            <p className="big-promo__modal-terms">
              Valid till {selected.validTill ?? "today"}.
            </p>
            <div className="big-promo__modal-actions">
              <button className="btn btn-outline" type="button" onClick={() => setSelected(null)}>
                Close
              </button>
              <button className="btn" type="button">
                Apply Promo
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default BigPromo;
