import type React from "react";
import "../styles/MealCard.css";

interface MealCardProps {
  title: string;
  description: string;
  price: string;
  image: string;
  tag?: string;
  onSelect?: () => void;
}

const MealCard = ({ title, description, price, image, tag, onSelect }: MealCardProps) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (!onSelect) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect();
    }
  };

  return (
    <article
      className="meal-card card shimmer"
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
    >
      <img src={image} alt={title} />
      <div className="meal-card__body">
        {tag && (
          <span className={`badge ${tag === "Light" ? "badge-light" : ""}`}>
            {tag}
          </span>
        )}
        <h3>{title}</h3>
        <p className="muted">{description}</p>
        <div className="meal-card__footer">
          <strong>{price}</strong>
          <button
            className="btn"
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onSelect?.();
            }}
          >
            Order Now
          </button>
        </div>
      </div>
    </article>
  );
};

export default MealCard;
