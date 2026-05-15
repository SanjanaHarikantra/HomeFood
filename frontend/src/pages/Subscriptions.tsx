import SubscriptionCard from "../components/SubscriptionCard";
import "../styles/Subscriptions.css";
import type { BackendSubscriptionPlan } from "../lib/backend";

export type SubscriptionPlan = {
  title: string;
  tag: string;
  price: string;
  period: string;
  perks: string[];
  icon: string;
  popular?: boolean;
  variant?: "accent";
};

interface SubscriptionsProps {
  onSelectPlan: (plan: SubscriptionPlan) => void;
  backendPlans?: BackendSubscriptionPlan[];
}

const Subscriptions = ({ onSelectPlan, backendPlans = [] }: SubscriptionsProps) => {
  const derivedPlans: SubscriptionPlan[] =
    backendPlans.length > 0
      ? backendPlans.map((plan, index) => ({
          title: plan.name,
          tag: index === 0 ? "Essential" : index === 1 ? "Popular" : "Ultimate",
          price: Number(plan.price).toLocaleString("en-IN"),
          period: `${plan.duration_days} days`,
          perks: [
            `${plan.duration_days}-day meal support`,
            plan.description || "Curated meal plan",
            "Flexible delivery schedule",
          ],
          icon: index === 0 ? "🛡️" : index === 1 ? "⭐" : "👑",
          popular: index === 1,
          variant: index === 1 ? "accent" : undefined,
        }))
      : [
          {
            title: "Silver Plan",
            tag: "Essential",
            price: "2,799",
            period: "Monthly",
            perks: [
              "5 lunches / week",
              "Balanced nutrition",
              "Standard delivery",
              "Eco-friendly packaging",
            ],
            icon: "🛡️",
          },
          {
            title: "Gold Plan",
            tag: "The Executive",
            price: "3,499",
            period: "Monthly",
            perks: [
              "6 lunches / week",
              "Gourmet menu",
              "Priority support",
              "Weekend specials",
              "Calorie tracking",
            ],
            icon: "⭐",
            popular: true,
            variant: "accent",
          },
          {
            title: "Premium Plan",
            tag: "The Ultimate",
            price: "4,299",
            period: "Monthly",
            perks: [
              "All meals included",
              "Meal consultation",
              "Healthy juices",
              "White-glove delivery",
              "Full customization",
            ],
            icon: "👑",
          },
        ];

  return (
    <section className="section subscriptions-page" id="subscriptions-page">
      <div className="subscriptions-hero">
        <span className="subscriptions-hero__pill">New Spring Menu</span>
        <h1>
          Gourmet Dining,
          <span>Delivered Daily.</span>
        </h1>
        <p>
          Convenience meets culinary excellence. Curated plans for those who refuse
          to compromise on taste.
        </p>
      </div>

      <div className="grid grid-3 subscriptions-grid">
        {derivedPlans.map((plan) => (
          <SubscriptionCard
            key={plan.title}
            title={plan.title}
            tag={plan.tag}
            price={plan.price}
            period={plan.period}
            perks={plan.perks}
            cta={`Choose ${plan.title}`}
            icon={plan.icon}
            popular={plan.popular}
            variant={plan.variant}
            onSelect={() => onSelectPlan(plan)}
          />
        ))}
      </div>

      <div className="subscriptions-faq">
        <h2>FAQ</h2>
        <div className="faq-list">
          <div className="faq-item">Can I pause my subscription?</div>
          <div className="faq-item">Is the menu the same every week?</div>
          <div className="faq-item">Do you cater to specific allergies?</div>
        </div>
      </div>
    </section>
  );
};

export default Subscriptions;
