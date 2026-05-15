import "../styles/Chef.css";

type ChefProfileForm = {
  kitchenName: string;
  ownerName: string;
  area: string;
  city: string;
  cuisineTag: string;
  bio: string;
  image: string;
};

type ChefWelcomeProps = {
  profile: ChefProfileForm;
  onSave: (profile: ChefProfileForm) => void;
  onChangeRole: () => void;
};

const steps = [
  {
    id: "register",
    title: "Register Kitchen",
    description:
      "Fill in kitchen address, license details, and contact information to verify your home studio.",
    tag: "STEP 1",
    marker: "K",
  },
  {
    id: "menu",
    title: "Menu Setup",
    description:
      "Add your signature dishes, set competitive pricing, availability, and upload mouth-watering photos.",
    tag: "STEP 2",
    marker: "M",
  },
  {
    id: "online",
    title: "Go Online",
    description:
      "Toggle your availability status to Online and start receiving orders from hungry neighbors.",
    tag: "STEP 3",
    marker: "O",
  },
];

const heroMetrics = [
  { label: "Kitchen readiness", value: "85%" },
  { label: "Orders waiting", value: "12" },
  { label: "Avg rating", value: "4.8★" },
];

const heroImage =
  "https://static.vecteezy.com/system/resources/previews/046/490/576/non_2x/african-american-woman-cooking-wearing-an-apron-female-chef-preparing-food-concept-of-cooking-kitchen-and-domestic-activities-graphic-art-vector.jpg";

const ChefWelcome = ({ profile, onSave, onChangeRole }: ChefWelcomeProps) => {
  return (
    <section className="chef-page chef-welcome-page">
      <div className="chef-page__wrap chef-welcome__wrap">
        <article className="chef-welcome__hero">
          <div className="chef-welcome__hero-glow chef-welcome__hero-glow--one" />
          <div className="chef-welcome__hero-glow chef-welcome__hero-glow--two" />

          <div className="chef-welcome__hero-topbar">
            <div className="chef-welcome__hero-brand">
              <div className="chef-welcome__hero-brandmark">S</div>
              <div>
                <strong>{profile.kitchenName}</strong>
                <span>Home chef onboarding</span>
              </div>
            </div>
            <div className="chef-welcome__hero-top-actions">
              <button
                type="button"
                className="chef-welcome__hero-pill chef-welcome__hero-pill--ghost"
                onClick={onChangeRole}
              >
                Change Role
              </button>
              <button
                type="button"
                className="chef-welcome__hero-pill chef-welcome__hero-pill--white"
                onClick={() => onSave(profile)}
              >
                Continue to Dashboard
              </button>
            </div>
          </div>

          <div className="chef-welcome__hero-inner chef-welcome__hero-inner--split">
            <div className="chef-welcome__hero-copy">
              <p className="chef-page__eyebrow">Home Chef Onboarding</p>
              <h1>
                <span className="chef-welcome__hero-line-break">Cook.</span>
                <span className="chef-welcome__hero-line-break">Serve.</span>
                <span className="chef-welcome__hero-line-break chef-welcome__hero-line-break--accent">
                  Prosper.
                </span>
              </h1>
              <p>
                Your culinary journey starts here. We&apos;ve simplified the setup so you can focus on what matters:
                the perfect dish.
              </p>

              <div className="chef-welcome__hero-metrics">
                {heroMetrics.map((metric) => (
                  <div key={metric.label} className="chef-welcome__hero-metric">
                    <strong>{metric.value}</strong>
                    <span>{metric.label}</span>
                  </div>
                ))}
              </div>

              <div className="chef-page__hero-actions chef-welcome__hero-actions">
                <button type="button" className="chef-welcome__hero-button" onClick={() => onSave(profile)}>
                  Continue to Dashboard
                </button>
                <button
                  type="button"
                  className="chef-welcome__hero-button chef-welcome__hero-button--secondary"
                  onClick={onChangeRole}
                >
                  Change Role
                </button>
              </div>
            </div>

            <div className="chef-welcome__hero-visual">
              <div className="chef-welcome__hero-panel chef-welcome__hero-panel--image">
                <div className="chef-welcome__hero-image-frame">
                  <img src={heroImage} alt="African American woman cooking wearing an apron" className="chef-welcome__hero-image" />
                  <div className="chef-welcome__hero-image-glow" aria-hidden="true" />
                </div>

                <div className="chef-welcome__hero-image-card">
                  <span className="chef-welcome__hero-image-card-label">Chef focus</span>
                  <strong>Cook with confidence</strong>
                  <small>Build your kitchen profile and launch with style.</small>
                </div>
              </div>
            </div>
          </div>
        </article>

        <div className="chef-dashboard__steps">
          {steps.map((step, index) => (
            <article
              key={step.id}
              className="chef-dashboard__step-card chef-dashboard__step-card--animated"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <div className="chef-dashboard__step-head">
                <span className="chef-dashboard__step-marker">{step.marker}</span>
                <small>{step.tag}</small>
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChefWelcome;
