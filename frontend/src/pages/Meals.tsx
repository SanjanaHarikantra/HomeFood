import KitchenCard from "../components/KitchenCard";
import MealCard from "../components/MealCard";

interface MealsProps {
  meals: {
    id: string;
    title: string;
    description: string;
    price: number;
    image: string;
    rating: string;
    tag?: string;
  }[];
  onSelectMeal: (meal: MealsProps["meals"][number]) => void;
}

const Meals = ({ meals, onSelectMeal }: MealsProps) => {
  const handleViewMenu = () => {
    const target = document.getElementById("meals-list");
    target?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="section" id="meals">
      <div className="section-header">
        <h2>Nearby Kitchens</h2>
        <p>Based on your current office location.</p>
      </div>

      <div className="nearby-three-grid">
        <KitchenCard
          name="Ghar Ka Rasoi"
          distance="1.8 km"
          rating="4.8★"
          time="30 min"
          image="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80"
          onSelect={handleViewMenu}
        />
        <KitchenCard
          name="Bambai Tiffins"
          distance="2.4 km"
          rating="4.7★"
          time="28 min"
          image="https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=800&q=80"
          onSelect={handleViewMenu}
        />
        <KitchenCard
          name="Aai’s Dabba"
          distance="1.2 km"
          rating="4.9★"
          time="22 min"
          image="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80"
          onSelect={handleViewMenu}
        />
        <KitchenCard
          name="Soulful Thali"
          distance="3.2 km"
          rating="4.6★"
          time="35 min"
          image="https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80"
          onSelect={handleViewMenu}
        />
        <KitchenCard
          name="Mumbai Spice Kitchen"
          distance="2.6 km"
          rating="4.7★"
          time="29 min"
          image="https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80"
          onSelect={handleViewMenu}
        />
        <KitchenCard
          name="Office Lunch Hub"
          distance="2.2 km"
          rating="4.8★"
          time="24 min"
          image="https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80"
          onSelect={handleViewMenu}
        />
        <KitchenCard
          name="Protein Factory"
          distance="3.4 km"
          rating="4.5★"
          time="32 min"
          image="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80"
          onSelect={handleViewMenu}
        />
      </div>

      <div className="section meals-search-results" id="meals-list">
        <div className="section-header">
          <h2>Meals Near You</h2>
          <p>Top meal matches from nearby kitchens with quick delivery.</p>
        </div>

        <div className="meals-three-grid">
          {meals.map((meal) => (
            <MealCard
              key={meal.id}
              title={meal.title}
              description={meal.description}
              price={`₹${meal.price}`}
              image={meal.image}
              tag={meal.tag}
              onSelect={() => onSelectMeal(meal)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Meals;
