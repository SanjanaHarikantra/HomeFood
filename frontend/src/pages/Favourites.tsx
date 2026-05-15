import { useMemo, useState } from "react";
import "../styles/Favourites.css";

type FavouriteTab = "Dishes" | "Kitchens";

type FavouriteDish = {
  id: string;
  name: string;
  kitchen: string;
  price: number;
  rating: number;
  image: string;
  description: string;
  tag?: string;
};

type FavouriteKitchen = {
  id: string;
  name: string;
  rating: number;
  description: string;
  image: string;
};

interface FavouritesProps {
  onAddToCart: (meal: {
    id: string;
    title: string;
    description: string;
    price: number;
    image: string;
    rating: string;
    tag?: string;
  }) => void;
}

const INITIAL_DISHES: FavouriteDish[] = [
  {
    id: "fav-dish-1",
    name: "Paneer Millet Bowl",
    kitchen: "Healthy Bowls",
    price: 229,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    description: "Millet pulao, paneer tikka, saute veggies",
    tag: "Veg",
  },
  {
    id: "fav-dish-2",
    name: "Chicken Curry Tiffin",
    kitchen: "Noor Kitchen",
    price: 249,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80",
    description: "Steamed rice, home-style chicken curry, salad",
    tag: "Non-Veg",
  },
  {
    id: "fav-dish-3",
    name: "Comfort Khichdi Combo",
    kitchen: "Aai's Kitchen",
    price: 149,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80",
    description: "Moong dal khichdi, ghee, papad, buttermilk",
    tag: "Veg",
  },
];

const INITIAL_KITCHENS: FavouriteKitchen[] = [
  {
    id: "fav-kit-1",
    name: "Noor Kitchen",
    rating: 4.8,
    description: "North Indian comfort meals with light daily thalis.",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "fav-kit-2",
    name: "Aai's Kitchen",
    rating: 4.9,
    description: "Home-style Maharashtrian lunch, fresh every day.",
    image:
      "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80",
  },
];

const Favourites = ({ onAddToCart }: FavouritesProps) => {
  const [tab, setTab] = useState<FavouriteTab>("Dishes");
  const [dishes, setDishes] = useState(INITIAL_DISHES);
  const [kitchens, setKitchens] = useState(INITIAL_KITCHENS);

  const mostOrderedDish = useMemo(() => dishes[0] ?? null, [dishes]);

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    window.location.hash = "#home";
  };

  const removeDish = (id: string) => {
    setDishes((prev) => prev.filter((dish) => dish.id !== id));
  };

  const removeKitchen = (id: string) => {
    setKitchens((prev) => prev.filter((kitchen) => kitchen.id !== id));
  };

  const currentEmpty = tab === "Dishes" ? dishes.length === 0 : kitchens.length === 0;

  return (
    <section className="section favourites-page">
      <header className="favourites-page__topbar">
        <button type="button" className="favourites-page__back" onClick={handleBack} aria-label="Go back">
          &lt;
        </button>
        <h1>Favourites â¤ï¸</h1>
      </header>

      <div className="favourites-page__tabs" role="tablist" aria-label="Favourites tabs">
        {(["Dishes", "Kitchens"] as FavouriteTab[]).map((item) => (
          <button
            key={item}
            type="button"
            className={`favourites-page__tab ${tab === item ? "is-active" : ""}`}
            onClick={() => setTab(item)}
          >
            {item === "Dishes" ? "ðŸ½ï¸ Dishes" : "ðŸ  Kitchens"}
          </button>
        ))}
      </div>

      {!currentEmpty && (
        <section className="favourites-page__smart">
          <article>
            <strong>Most Ordered</strong>
            <p>{mostOrderedDish ? mostOrderedDish.name : "Top picks based on your orders"}</p>
          </article>
          <article>
            <strong>AI Reco</strong>
            <p>Try protein-rich combos based on your recent meals.</p>
          </article>
        </section>
      )}

      {currentEmpty ? (
        <section className="favourites-page__empty">
          <div className="favourites-page__empty-ill" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <h3>No favourites yet â¤ï¸</h3>
          <p>Save dishes you love!</p>
          <button type="button" onClick={() => (window.location.hash = "#meals")}>
            Explore Food
          </button>
        </section>
      ) : (
        <>
          {tab === "Dishes" && (
            <section className="favourites-page__list">
              {dishes.map((dish) => (
                <article key={dish.id} className="favourites-page__dish-card">
                  <img src={dish.image} alt={dish.name} />
                  <div className="favourites-page__dish-body">
                    <div className="favourites-page__row">
                      <h3>{dish.name}</h3>
                      <button
                        type="button"
                        className="favourites-page__heart"
                        aria-label="Remove from favourites"
                        onClick={() => removeDish(dish.id)}
                      >
                        â¤ï¸
                      </button>
                    </div>
                    <p>{dish.kitchen}</p>
                    <div className="favourites-page__meta">
                      <span>Rs {dish.price}</span>
                      <span>â­ {dish.rating.toFixed(1)}</span>
                    </div>
                    <div className="favourites-page__actions">
                      <button
                        type="button"
                        className="favourites-page__primary"
                        onClick={() => onAddToCart({
                          id: dish.id,
                          title: dish.name,
                          description: dish.description,
                          price: dish.price,
                          image: dish.image,
                          rating: `${dish.rating.toFixed(1)}â˜…`,
                          tag: dish.tag,
                        })}
                      >
                        Add to Cart
                      </button>
                      <button
                        type="button"
                        className="favourites-page__ghost"
                        onClick={() => (window.location.hash = "#cart")}
                      >
                        Reorder
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          )}

          {tab === "Kitchens" && (
            <section className="favourites-page__list">
              {kitchens.map((kitchen) => (
                <article key={kitchen.id} className="favourites-page__kitchen-card">
                  <img src={kitchen.image} alt={kitchen.name} />
                  <div className="favourites-page__kitchen-body">
                    <div className="favourites-page__row">
                      <h3>{kitchen.name}</h3>
                      <button
                        type="button"
                        className="favourites-page__heart"
                        aria-label="Remove from favourites"
                        onClick={() => removeKitchen(kitchen.id)}
                      >
                        â¤ï¸
                      </button>
                    </div>
                    <p>{kitchen.description}</p>
                    <div className="favourites-page__meta">
                      <span>â­ {kitchen.rating.toFixed(1)}</span>
                    </div>
                    <div className="favourites-page__actions">
                      <button
                        type="button"
                        className="favourites-page__primary"
                        onClick={() => (window.location.hash = "#meals")}
                      >
                        View Menu
                      </button>
                      <button
                        type="button"
                        className="favourites-page__ghost"
                        onClick={() => (window.location.hash = "#meals")}
                      >
                        Order Now
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          )}
        </>
      )}
    </section>
  );
};

export default Favourites;

