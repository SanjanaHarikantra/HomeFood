import "../styles/CustomerReviewCard.css";

interface CustomerReviewCardProps {
  name: string;
  quote: string;
  image: string;
}

const CustomerReviewCard = ({ name, quote, image }: CustomerReviewCardProps) => {
  return (
    <article className="review-card card">
      <div className="review-card__top">
        <img src={image} alt={name} />
        <div>
          <h4>{name}</h4>
          <p className="muted">Office Executive</p>
        </div>
      </div>
      <p>“{quote}”</p>
    </article>
  );
};

export default CustomerReviewCard;
