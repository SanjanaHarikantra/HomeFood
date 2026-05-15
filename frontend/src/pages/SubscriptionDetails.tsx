import { SubscriptionPlan } from "./Subscriptions";
import "../styles/SubscriptionFlow.css";

interface SubscriptionDetailsProps {
  plan: SubscriptionPlan | null;
  onContinue: () => void;
  onBack: () => void;
}

const SubscriptionDetails = ({ plan, onContinue, onBack }: SubscriptionDetailsProps) => {
  if (!plan) {
    return (
      <section className="section subscription-flow">
        <div className="subscription-card">
          <h2>Select a plan to continue</h2>
          <p className="subscription-note">
            Please choose a subscription plan to view details.
          </p>
          <div className="subscription-actions">
            <button className="btn" type="button" onClick={onBack}>
              Go to Plans
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section subscription-flow">
      <div className="subscription-steps">
        <div className="subscription-step active">Plan</div>
        <div className="subscription-step">Details</div>
        <div className="subscription-step">Address</div>
        <div className="subscription-step">Payment</div>
        <div className="subscription-step">Confirm</div>
      </div>

      <div className="subscription-card">
        <h2>Subscription Details</h2>
        <div className="subscription-plan">
          <strong>{plan.title}</strong>
          <span>{plan.tag} • {plan.period}</span>
          <span>₹{plan.price} / {plan.period}</span>
        </div>
        <ul className="subscription-list">
          {plan.perks.map((perk) => (
            <li key={perk}>{perk}</li>
          ))}
        </ul>
        <div className="subscription-actions">
          <button className="btn btn-outline" type="button" onClick={onBack}>
            Change Plan
          </button>
          <button className="btn" type="button" onClick={onContinue}>
            Continue
          </button>
        </div>
      </div>
    </section>
  );
};

export default SubscriptionDetails;
