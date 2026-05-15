import AddOnsCard from "../components/AddOnsCard";
import "../styles/MealDetail.css";

interface Meal {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  rating: string;
  tag?: string;
}

interface MealDetailProps {
  meal: Meal | null;
  onAddToCart: (meal: Meal) => void;
}

const MealDetail = ({ meal, onAddToCart }: MealDetailProps) => {
  if (!meal) {
    return (
      <section className="section" id="meal-detail">
        <div className="section-header">
          <h2>Meal Detail</h2>
          <p>Select a meal to see more information.</p>
        </div>
        <div className="card" style={{ padding: "20px" }}>
          <p className="muted">No meal selected yet.</p>
          <button
            className="btn btn-outline"
            type="button"
            onClick={() => {
              window.location.hash = "#meals";
            }}
          >
            Browse Meals
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="section" id="meal-detail">
      <div className="section-header">
        <h2>{meal.title}</h2>
        <p>Steel tiffin packed with care.</p>
      </div>

      <div className="meal-detail-grid">
        <div className="card meal-detail-main">
          <img
            src={meal.image}
            alt={meal.title}
            className="meal-detail-main__image"
          />
          <div className="meal-detail-main__content">
            <div className="badge">{meal.rating}</div>
            <h3>{meal.title}</h3>
            <p className="muted">{meal.description}</p>
            <strong>₹{meal.price}</strong>
            <button
              className="btn"
              type="button"
              onClick={() => onAddToCart(meal)}
            >
              Add to Cart
            </button>
          </div>
        </div>

        <AddOnsCard title="Dairy" items={["Curd", "Buttermilk", "Paneer cubes"]} />
        <AddOnsCard title="Fruits" items={["Seasonal bowl", "Fresh orange", "Mixed berries"]} />
        <AddOnsCard title="Protein & Health" items={["Boiled eggs", "Tofu", "Sprouts"]} />
      </div>
    </section>
  );
};

export default MealDetail;
