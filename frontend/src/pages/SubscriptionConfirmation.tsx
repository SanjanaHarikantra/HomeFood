import { SubscriptionPlan } from "./Subscriptions";
import "../styles/SubscriptionFlow.css";
import type { BackendCreatedSubscription } from "../lib/backend";

interface SubscriptionConfirmationProps {
  plan: SubscriptionPlan | null;
  address: string;
  paymentMethod: string;
  subscriptionResult: BackendCreatedSubscription | null;
  subscriptionError: string;
  subscriptionDelivery: {
    provider: "Porter";
    nextDeliveryTime: string;
    scheduleStatus: string;
    riderName: string;
    riderPhone: string;
    vehicleType: string;
  } | null;
  onBackToPlans: () => void;
}

const SubscriptionConfirmation = ({
  plan,
  address,
  paymentMethod,
  subscriptionResult,
  subscriptionError,
  subscriptionDelivery,
  onBackToPlans,
}: SubscriptionConfirmationProps) => {
  return (
    <section className="section subscription-flow">
      <div className="subscription-steps">
        <div className="subscription-step">Plan</div>
        <div className="subscription-step">Details</div>
        <div className="subscription-step">Address</div>
        <div className="subscription-step">Payment</div>
        <div className="subscription-step active">Confirm</div>
      </div>

      <div className="subscription-card">
        <h2>Subscription Confirmed</h2>
        <p className="subscription-note">
          {subscriptionError || "Thank you! Your subscription is active. We will deliver your first meal on the next available slot."}
        </p>
        <div className="subscription-plan">
          <strong>{plan?.title ?? "Selected Plan"}</strong>
          <span>{plan?.tag ?? ""}</span>
          <span>Payment: {paymentMethod || "Not selected"}</span>
        </div>
        {subscriptionResult && (
          <div className="subscription-plan">
            <strong>Subscription #{subscriptionResult.id}</strong>
            <span>Status: {subscriptionResult.status}</span>
            <span>
              {new Date(subscriptionResult.starts_on).toLocaleDateString()} - {new Date(subscriptionResult.ends_on).toLocaleDateString()}
            </span>
          </div>
        )}
        <div className="subscription-plan">
          <strong>Delivery Address</strong>
          <span>{address || "No address provided"}</span>
        </div>
        <div className="subscription-plan subscription-plan--delivery">
          <strong>Subscription Delivery Tracking</strong>
          <span>Next delivery time: {subscriptionDelivery?.nextDeliveryTime ?? "Scheduled for next slot"}</span>
          <span>Status: {subscriptionDelivery?.scheduleStatus ?? "Scheduled"}</span>
          <span>Delivery partner: {subscriptionDelivery?.provider ?? "Porter"}</span>
          <span>Rider: {subscriptionDelivery?.riderName ?? "Assigned before delivery"}</span>
          <span>Phone: {subscriptionDelivery?.riderPhone ?? "Available on assignment"}</span>
          <span>Vehicle: {subscriptionDelivery?.vehicleType ?? "Bike"}</span>
        </div>
        <div className="subscription-actions">
          <button className="btn" type="button" onClick={onBackToPlans}>
            Back to Plans
          </button>
        </div>
      </div>
    </section>
  );
};

export default SubscriptionConfirmation;
