import "../styles/AddOnsCard.css";

interface AddOnsCardProps {
  title: string;
  items: string[];
}

const AddOnsCard = ({ title, items }: AddOnsCardProps) => {
  return (
    <div className="addons card">
      <h4>{title}</h4>
      <div className="addons__items">
        {items.map((item) => (
          <span className="pill" key={item}>{item}</span>
        ))}
      </div>
      <button className="btn btn-outline">Add to Tiffin</button>
    </div>
  );
};

export default AddOnsCard;
