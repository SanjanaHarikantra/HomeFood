import "../styles/RoleSelect.css";

type RoleSelectProps = {
  onSelectCustomer: () => void;
  onSelectHomeChef: () => void;
  onSelectHomemadeFood: () => void;
  onGoBack: () => void;
};

const RoleSelect = ({
  onSelectCustomer,
  onSelectHomeChef,
  onSelectHomemadeFood,
  onGoBack,
}: RoleSelectProps) => {
  return (
    <section className="role-select">
      <div className="role-select__card">
        <p className="role-select__eyebrow">Dabbawala</p>
        <h1>Choose how you want to continue</h1>
        <p className="role-select__sub">Customer, get home food, or Home Chef - select your profile</p>

        <div className="role-select__stack">
          <article
            className="role-select__panel role-select__panel--light"
            onClick={onSelectCustomer}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelectCustomer();
              }
            }}
          >
            <span className="role-select__label">Customer</span>
            <h2>Continue as Customer</h2>
            <p>Order, track, and manage subscriptions from top home chefs.</p>
            <button type="button" className="role-select__button" onClick={onSelectCustomer}>
              Customer -&gt;
            </button>
          </article>

          <article
            className="role-select__panel role-select__panel--accent"
            onClick={onSelectHomemadeFood}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelectHomemadeFood();
              }
            }}
          >
            <span className="role-select__label">Get Your Home Food</span>
            <h2>Continue as Get Your Home Food</h2>
            <p>Discover nearby home chefs, place tiffin orders, and track live delivery.</p>
            <button type="button" className="role-select__button" onClick={onSelectHomemadeFood}>
              Get Home Food -&gt;
            </button>
          </article>

          <article
            className="role-select__panel role-select__panel--dark"
            onClick={onSelectHomeChef}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelectHomeChef();
              }
            }}
          >
            <span className="role-select__label">Home Chef</span>
            <h2>Continue as Home Chef</h2>
            <p>Manage menu, orders, payouts, and kitchen profile.</p>
            <button
              type="button"
              className="role-select__button role-select__button--light"
              onClick={onSelectHomeChef}
            >
              Home Chef -&gt;
            </button>
          </article>
        </div>

        <button type="button" className="role-select__back" onClick={onGoBack}>
          Go back
        </button>
      </div>
    </section>
  );
};

export default RoleSelect;
