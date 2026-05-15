import { useEffect, useRef, useState } from "react";
import HeroBanner from "../components/HeroBanner";
import MealCard from "../components/MealCard";
import CustomerReviewCard from "../components/CustomerReviewCard";
import mic from "../assets/images/mic1.png";
import Open24Preview from "../components/Open24Preview";
import {
  buildPlacedMessage,
  processVoiceOrder,
  type VoiceAssistantResult,
} from "../utils/voiceOrderAssistant";

type SpeechRecognitionAlternative = {
  transcript: string;
  confidence: number;
};

type SpeechRecognitionResult = {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionAlternative;
};

type SpeechRecognitionResultList = {
  length: number;
  [index: number]: SpeechRecognitionResult;
};

type SpeechRecognitionEventLike = Event & {
  results: SpeechRecognitionResultList;
};

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: Event & { error?: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  }
}

interface HomeProps {
  meals: {
    id: string;
    title: string;
    description: string;
    price: number;
    image: string;
    rating: string;
    tag?: string;
  }[];
  featuredHomeMeals: {
    id: string;
    title: string;
    description: string;
    price: number;
    image: string;
    rating: string;
    tag?: string;
  }[];
  onSelectMeal: (meal: HomeProps["meals"][number]) => void;
  onNavigateMeals: () => void;
  activeOrder: {
    id: string;
    items: {
      title: string;
      quantity: number;
    }[];
    placedAt: string;
  } | null;
}

const Home = ({
  meals,
  featuredHomeMeals,
  onSelectMeal,
  onNavigateMeals,
  activeOrder,
}: HomeProps) => {
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [voiceInput, setVoiceInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [assistantMessage, setAssistantMessage] = useState("Tap mic and speak your order.");
  const [voiceResult, setVoiceResult] = useState<VoiceAssistantResult | null>(null);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const processInput = (text: string) => {
    const cleaned = text.trim();
    if (!cleaned) {
      setAssistantMessage("Please say or type your order.");
      setVoiceResult(null);
      setOrderConfirmed(false);
      return;
    }
    const result = processVoiceOrder(cleaned);
    setVoiceResult(result);
    setAssistantMessage(result.message);
    setOrderConfirmed(false);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognitionApi = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SpeechRecognitionApi) {
      setAssistantMessage("Voice input is not supported here. Please type your order.");
      return;
    }

    const recognition = new SpeechRecognitionApi();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript?.trim() ?? "";
      setVoiceInput(transcript);
      processInput(transcript);
    };

    recognition.onerror = () => {
      setAssistantMessage("I could not hear clearly. Please try again.");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const handleConfirmOrder = () => {
    if (!voiceResult || !voiceResult.canConfirm) {
      return;
    }
    setAssistantMessage(buildPlacedMessage(voiceResult.language, voiceResult.order));
    setOrderConfirmed(true);
  };

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  return (
    <section className="section section--home" id="home">
      <button
        className="voice-float"
        type="button"
        aria-label="Voice Ordering"
        onClick={() => setIsVoiceOpen((prev) => !prev)}
      >
        <span className="voice-float__icon">
          <img src={mic} alt="Voice ordering" />
        </span>
        <span className="voice-float__text">Voice Order</span>
      </button>
      {isVoiceOpen && (
        <div className="voice-panel card" role="dialog" aria-label="Voice order assistant">
          <div className="voice-panel__head">
            <h3>Voice Order Assistant</h3>
            <button type="button" className="voice-panel__close" onClick={() => setIsVoiceOpen(false)}>
              x
            </button>
          </div>
          <p className="muted">{assistantMessage}</p>
          <textarea
            className="voice-panel__input"
            value={voiceInput}
            onChange={(event) => setVoiceInput(event.target.value)}
            placeholder="Speak or type: Mujhe 2 veg thali chahiye"
            rows={3}
          />
          <div className="voice-panel__actions">
            <button type="button" className="btn btn-outline" onClick={toggleListening}>
              {isListening ? "Stop Mic" : "Start Mic"}
            </button>
            <button type="button" className="btn" onClick={() => processInput(voiceInput)}>
              Process
            </button>
          </div>
          {voiceResult && (
            <div className="voice-panel__result">
              <strong>Structured Order</strong>
              <p>Item: {voiceResult.order.itemName ?? "Not detected"}</p>
              <p>Quantity: {voiceResult.order.quantity ?? "Not detected"}</p>
              <p>Special Instructions: {voiceResult.order.specialInstructions ?? "None"}</p>
            </div>
          )}
          {voiceResult?.canConfirm && !orderConfirmed && (
            <button type="button" className="btn" onClick={handleConfirmOrder}>
              Confirm Order
            </button>
          )}
        </div>
      )}
      <HeroBanner
        onExplore={onNavigateMeals}
        onTrack={() => {
          window.location.hash = "#tracking";
        }}
      />
        {activeOrder && (
          <div className="card home-order-status">
            <div>
              <h3>Current Order</h3>
              <p className="muted">Order ID: {activeOrder.id}</p>
            <p className="muted">
              {activeOrder.items.map((item) => `${item.quantity}x ${item.title}`).join(", ")}
            </p>
            <p className="muted">Placed: {activeOrder.placedAt}</p>
          </div>
          <button
            className="btn"
            type="button"
            onClick={() => {
              window.location.hash = "#tracking";
            }}
          >
            Track Live
          </button>
        </div>
      )}

      <div className="section">
        <div className="section-header">
          <h2>Custom Meal Studio</h2>
          <p>Personalize daily food and attach a subscription plan in one premium flow.</p>
        </div>
        <div className="home-studio">
          <article className="home-studio__card home-studio__card--feature">
            <span className="home-studio__eyebrow">Custom Food</span>
            <h3>Build meals the way you like them</h3>
            <p>
              Pick meal, spice level, delivery slot, extras, and special instructions for your
              weekday routine.
            </p>
            <div className="home-studio__actions">
              <button
                type="button"
                className="btn"
                onClick={() => {
                  window.location.hash = "#customize-meal";
                }}
              >
                Open Customizer
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  window.location.hash = "#subscriptions";
                }}
              >
                View Plans
              </button>
            </div>
          </article>
          <article className="home-studio__card">
            <span className="home-studio__eyebrow">Subscription</span>
            <h3>Attach a plan to your meal routine</h3>
            <p>
              Add weekly or monthly subscription support while you customize daily food for the
              customer experience.
            </p>
            <div className="home-studio__plan-list">
              <div>
                <strong>Daily Flex</strong>
                <small>30 days</small>
              </div>
              <div>
                <strong>Weekly Saver</strong>
                <small>7 days</small>
              </div>
              <div>
                <strong>Monthly Premium</strong>
                <small>Priority support</small>
              </div>
            </div>
          </article>
        </div>
      </div>

      <div className="section discover home-pink" id="discover">
        <div className="pink-hero">
        <div className="pink-hero__top">
          <h2>
            Find Your
            <span>Favorite Food.</span>
          </h2>
          <span />
        </div>

          <div className="pink-hero__search">
            <span className="pink-hero__search-icon">🔎</span>
            <input
              type="text"
              placeholder="Search for dishes, kitchens, or subscriptions..."
              onFocus={() => {
                window.location.hash = "#search";
              }}
            />
            <button className="pink-hero__filter" type="button" aria-label="Filter">
              ⚙️
            </button>
          </div>

          <div className="pink-hero__banner">
            <div>
              <span>Special Deal For January</span>
              <h3>Special Deal For January</h3>
              <button
                type="button"
                className="pink-hero__cta"
                onClick={() => {
                  window.location.hash = "#subscriptions";
                }}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        <div className="discover-categories">
          {[
            { label: "Near Me", icon: "📍", href: "#near-me" },
            { label: "Big Promo", icon: "💯", href: "#big-promo" },
            { label: "Best Seller", icon: "⭐", href: "#best-seller" },
            { label: "Budget Meal", icon: "💲", href: "#budget-meal" },
            { label: "Healthy Food", icon: "🥗", href: "#healthy-food" },
            { label: "Open 24 Hours", icon: "🕒", href: "#open-24-hours" },
            { label: "Popular", icon: "🏪", href: "#popular" },
            { label: "More", icon: "➕", href: "#more-filters" },
          ].map((item) => (
            <a key={item.label} href={item.href} className="discover-category">
              <span className="discover-category__icon" aria-hidden="true">{item.icon}</span>
              {item.label}
            </a>
          ))}
        </div>

        <div className="discover-reco">
        <div className="discover-reco__head">
          <h4>Your Daily Deals</h4>
            <button
              type="button"
              className="discover-reco__link"
              onClick={() => {
                window.location.hash = "#meals";
              }}
            >
              See All
            </button>
          </div>
          <div className="discover-grid">
            {meals.slice(0, 6).map((meal) => (
              <button
                key={meal.id}
                type="button"
                className="discover-item"
                onClick={() => onSelectMeal(meal)}
              >
                <div className="discover-item__media">
                  <img src={meal.image} alt={meal.title} />
                  <span className="discover-item__deal">50% OFF</span>
                </div>
                <div className="discover-item__body">
                  <strong>{meal.title}</strong>
                  <small>25–35 mins • ₹{meal.price}</small>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="recent-orders home-desktop-only">
          <h4>Recently Ordered</h4>
          <div className="recent-orders__list">
            {meals.slice(0, 3).map((meal) => (
              <button
                key={meal.id}
                type="button"
                className="recent-orders__item"
                onClick={() => onSelectMeal(meal)}
              >
                <div className="recent-orders__media">
                  <img src={meal.image} alt={meal.title} />
                </div>
                <div className="recent-orders__body">
                  <strong>{meal.title}</strong>
                  <small>Reorder in one tap</small>
                </div>
                <span className="recent-orders__cta">Reorder</span>
              </button>
            ))}
          </div>
        </div>

        <div className="popular-near home-desktop-only">
          <h4>Popular Near You</h4>
          <div className="popular-near__grid">
            {meals.slice(3, 6).map((meal) => (
              <button
                key={meal.id}
                type="button"
                className="popular-near__item"
                onClick={() => onSelectMeal(meal)}
              >
                <div className="popular-near__media">
                  <img src={meal.image} alt={meal.title} />
                </div>
                <div className="popular-near__body">
                  <strong>{meal.title}</strong>
                  <small>Trending in your area</small>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <Open24Preview />

      <div className="section">
        {featuredHomeMeals.length > 0 && (
          <>
            <div className="section-header">
              <h2>Fresh From Home Chefs</h2>
              <p>Latest dishes added by chefs are visible here for customer ordering.</p>
            </div>
            <div className="grid grid-3">
              {featuredHomeMeals.slice(0, 3).map((meal) => (
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
          </>
        )}
      </div>

      <div className="section">
        <div className="section-header">
          <h2>Today’s Special</h2>
          <p>Curated meals for a warm and healthy office lunch.</p>
        </div>
        <div className="grid grid-2">
          {meals.slice(0, 3).map((meal) => (
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

      <div className="section">
        <div className="section-header">
          <h2>Customer Love</h2>
          <p>“Better than restaurant food!”</p>
        </div>
        <div className="grid grid-3">
          <CustomerReviewCard
            name="Ayesha Khan"
            quote="Tastes like home every single day."
            image="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80"
          />
          <CustomerReviewCard
            name="Rohan Mehta"
            quote="The tiffin always arrives warm, love the extras."
            image="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80"
          />
          <CustomerReviewCard
            name="Sneha Patil"
            quote="Healthy streaks and reminders are a game changer."
            image="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=400&q=80"
          />
        </div>
      </div>

      <div className="section">
          <div className="grid grid-3">
          <div className="card" style={{ padding: "20px" }}>
            <h3>Referral Rewards</h3>
            <p className="muted">Invite 3 friends to unlock Gold tier perks.</p>
            <div className="progress">
              <div className="progress__bar" style={{ width: "60%" }} />
            </div>
          </div>
          <div className="card" style={{ padding: "20px" }}>
            <h3>Loyalty Badge</h3>
            <p className="muted">22 deliveries in a row — keep the streak.</p>
            <span className="badge">Dabba Legend</span>
          </div>
          <div className="card" style={{ padding: "20px" }}>
            <h3>Kitchen Intro Video</h3>
            <p className="muted">Short stories from our trusted kitchens.</p>
            <button
              className="btn btn-outline"
              type="button"
              onClick={() => {
                window.location.hash = "#open-24-hours";
              }}
            >
              Play Preview
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;




