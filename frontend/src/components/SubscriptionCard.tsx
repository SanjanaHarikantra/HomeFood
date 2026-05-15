import "../styles/SubscriptionCard.css";

interface SubscriptionCardProps {
  title: string;
  price: string;
  period: string;
  perks: string[];
  cta: string;
  tag?: string;
  icon?: string;
  popular?: boolean;
  variant?: "dark" | "accent";
  onSelect?: () => void;
}

const SubscriptionCard = ({
  title,
  price,
  period,
  perks,
  cta,
  tag,
  icon,
  popular,
  variant = "dark",
  onSelect,
}: SubscriptionCardProps) => {
  return (
    <article className={`subscription-card card ${popular ? "is-popular" : ""}`}>
      {popular && <span className="subscription-card__badge">Best Value</span>}
      <div className="subscription-card__header">
        <div className="subscription-card__icon" aria-hidden="true">{icon ?? "✨"}</div>
        <div>
          <h3>{title}</h3>
          {tag && <small>{tag}</small>}
        </div>
      </div>
      <div className="subscription-card__price">
        <span className="currency">₹</span>
        <span className="value">{price}</span>
        <span className="period">{period}</span>
      </div>
      <ul>
        {perks.map((perk) => (
          <li key={perk}>{perk}</li>
        ))}
      </ul>
      <button
        className={`subscription-card__cta ${variant === "accent" ? "is-accent" : ""}`}
        type="button"
        onClick={onSelect}
      >
        {cta}
      </button>
    </article>
  );
};

export default SubscriptionCard;
