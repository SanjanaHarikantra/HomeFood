import "../styles/SubscriptionFlow.css";

interface SubscriptionAddressProps {
  address: string;
  onAddressChange: (value: string) => void;
  onContinue: () => void;
  onBack: () => void;
}

const SubscriptionAddress = ({
  address,
  onAddressChange,
  onContinue,
  onBack,
}: SubscriptionAddressProps) => {
  return (
    <section className="section subscription-flow">
      <div className="subscription-steps">
        <div className="subscription-step">Plan</div>
        <div className="subscription-step">Details</div>
        <div className="subscription-step active">Address</div>
        <div className="subscription-step">Payment</div>
        <div className="subscription-step">Confirm</div>
      </div>

      <div className="subscription-card">
        <h2>Delivery Address</h2>
        <label className="subscription-field">
          Address
          <textarea
            rows={4}
            placeholder="Enter your delivery address"
            value={address}
            onChange={(event) => onAddressChange(event.target.value)}
          />
        </label>
        <p className="subscription-note">
          We deliver Monday to Saturday between 12:30pm and 2:30pm.
        </p>
        <div className="subscription-actions">
          <button className="btn btn-outline" type="button" onClick={onBack}>
            Back
          </button>
          <button className="btn" type="button" onClick={onContinue}>
            Continue to Payment
          </button>
        </div>
      </div>
    </section>
  );
};

export default SubscriptionAddress;
