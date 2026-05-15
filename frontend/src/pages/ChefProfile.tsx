import "../styles/Chef.css";

type ChefProfileInfo = {
  kitchenName: string;
  ownerName: string;
  area: string;
  city: string;
  cuisineTag: string;
  bio: string;
  rating: string;
  reviewCount: number;
  payout: string;
  onlineHours: string;
  image: string;
};

type ChefProfileProps = {
  profile: ChefProfileInfo;
  online: boolean;
};

const ChefProfile = ({ profile, online }: ChefProfileProps) => {
  return (
    <section className="chef-page chef-profile-page">
      <div className="chef-page__wrap chef-profile__wrap">
        <article className="chef-page__hero chef-profile__hero">
          <div className="chef-profile__hero-copy">
            <p className="chef-page__eyebrow">Chef Profile</p>
            <h1>{profile.kitchenName}</h1>
            <p>{profile.bio || "Keep your kitchen profile updated for nearby customers."}</p>
            <div className="chef-profile__hero-meta">
              <span>{profile.ownerName}</span>
              <span>{profile.area}, {profile.city}</span>
              <span className={online ? "is-online" : "is-offline"}>{online ? "Online" : "Offline"}</span>
            </div>
          </div>
          <img className="chef-profile__hero-image" src={profile.image} alt={profile.kitchenName} />
        </article>

        <div className="chef-page__grid chef-profile__grid">
          <article className="chef-page__card chef-profile__card">
            <span className="chef-page__tag">Kitchen</span>
            <h3>{profile.kitchenName}</h3>
            <p>{profile.ownerName} • {profile.area}, {profile.city}</p>
            <p>{profile.cuisineTag}</p>
          </article>

          <article className="chef-page__card chef-profile__card chef-profile__rating">
            <span className="chef-page__tag">Customer Rating</span>
            <h3>{profile.rating}</h3>
            <p>Based on {profile.reviewCount} customer review{profile.reviewCount === 1 ? "" : "s"}.</p>
            <div className="chef-profile__stars" aria-label={`Rating ${profile.rating}`}>
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
            </div>
          </article>

          <article className="chef-page__card chef-profile__card">
            <span className="chef-page__tag">Payout</span>
            <h3>{profile.payout}</h3>
            <p>{online ? "Kitchen is live right now." : "Kitchen is currently offline."}</p>
          </article>

          <article className="chef-page__card chef-profile__card">
            <span className="chef-page__tag">Availability</span>
            <h3>{online ? "Online" : "Offline"}</h3>
            <p>{profile.onlineHours}</p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default ChefProfile;
