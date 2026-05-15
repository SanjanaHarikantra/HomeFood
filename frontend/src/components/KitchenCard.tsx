import "../styles/KitchenCard.css";

interface KitchenCardProps {
  name: string;
  distance: string;
  rating: string;
  time: string;
  image: string;
  onSelect?: () => void;
}

const KitchenCard = ({ name, distance, rating, time, image, onSelect }: KitchenCardProps) => {
  return (
    <article className="kitchen-card card">
      <img src={image} alt={name} />
      <div className="kitchen-card__body">
        <h4>{name}</h4>
        <p className="muted">{distance} • {rating} • {time}</p>
        <button className="btn btn-outline" type="button" onClick={onSelect}>
          View Menu
        </button>
      </div>
    </article>
  );
};

export default KitchenCard;
