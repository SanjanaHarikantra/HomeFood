import { useEffect } from "react";
import "../styles/SubscriptionFlow.css";

interface SubscriptionPaymentProps {
  paymentMethod: string;
  onSelectPayment: (value: string) => void;
  onContinue: () => void;
  onBack: () => void;
}

const SubscriptionPayment = ({
  paymentMethod,
  onSelectPayment,
  onContinue,
  onBack,
}: SubscriptionPaymentProps) => {
  useEffect(() => {
    if (!paymentMethod) {
      onSelectPayment("UPI");
    }
  }, [onSelectPayment, paymentMethod]);

  return (
    <section className="section subscription-flow">
      <div className="subscription-steps">
        <div className="subscription-step">Plan</div>
        <div className="subscription-step">Details</div>
        <div className="subscription-step">Address</div>
        <div className="subscription-step active">Payment</div>
        <div className="subscription-step">Confirm</div>
      </div>

      <div className="subscription-card">
        <h2>Choose Payment Method</h2>
        <p className="subscription-note">
          Select one option to continue. UPI is chosen by default if you do not pick a method.
        </p>
        <div className="subscription-radio">
          {[
            "UPI",
            "Credit / Debit Card",
            "Net Banking",
            "Cash on Delivery",
          ].map((method) => (
            <label key={method}>
              <input
                type="radio"
                name="subscription-payment"
                checked={paymentMethod === method}
                onChange={() => onSelectPayment(method)}
              />
              <span>{method}</span>
            </label>
          ))}
        </div>
        <div className="subscription-actions">
          <button className="btn btn-outline" type="button" onClick={onBack}>
            Back
          </button>
          <button className="btn" type="button" onClick={onContinue} disabled={!paymentMethod}>
            Review & Confirm
          </button>
        </div>
      </div>
    </section>
  );
};

export default SubscriptionPayment;
