import "../styles/Chef.css";

type ChefArea = {
  name: string;
  orders: string;
  highlight?: boolean;
};

type ChefNearbyProps = {
  areas: ChefArea[];
};

const areaMap: Record<string, { coords: string; progress: number }> = {
  "Bandra West": { coords: "19.0544° N, 72.8402° E", progress: 92 },
  "Andheri East": { coords: "19.1136° N, 72.8697° E", progress: 63 },
  Powai: { coords: "19.1176° N, 72.9060° E", progress: 37 },
};

const getDemand = (orders: string) => {
  const match = orders.match(/\d+/);
  return match ? Number(match[0]) : 0;
};

const ChefNearby = ({ areas }: ChefNearbyProps) => {
  const openArea = (areaName: string) => {
    window.location.hash = "#chef-orders";
    window.localStorage.setItem("chef_nearby_focus", areaName);
  };

  return (
    <section className="chef-page chef-nearby">
      <div className="chef-page__wrap chef-nearby__wrap">
        <article className="chef-page__hero chef-nearby__hero">
          <p className="chef-page__eyebrow chef-nearby__eyebrow">
            <span className="chef-nearby__dot" />
            Nearby Demand
          </p>
          <h1>
            See where the <span>orders</span> are coming from
          </h1>
          <p>
            Real-time analytics showing local demand and order hotspots around your kitchen area.
            Stay ahead of the rush by positioning your fleet optimally.
          </p>
        </article>

        <div className="chef-nearby__grid">
          {areas.map((item, index) => {
            const meta = areaMap[item.name] ?? { coords: "Local hotspot", progress: 50 };
            const demand = getDemand(item.orders);

            return (
              <article
                key={item.name}
                className={`chef-nearby__card ${item.highlight ? "is-hot" : ""}`}
                style={{ animationDelay: `${index * 110}ms` }}
              >
                <div className="chef-nearby__card-top">
                  <span className="chef-nearby__tag">{item.highlight ? "Hot Zone" : "Area"}</span>
                  <span className={`chef-nearby__pulse chef-nearby__pulse--${(index % 3) + 1}`} />
                </div>

                <div className="chef-nearby__card-copy">
                  <h3>{item.name}</h3>
                  <p className="chef-nearby__coords">{meta.coords}</p>
                  <div className="chef-nearby__count">
                    <strong>{demand}</strong>
                    <span>active requests</span>
                  </div>
                </div>

                <div className="chef-nearby__progress" aria-hidden="true">
                  <span style={{ width: `${meta.progress}%` }} />
                </div>

                <div className="chef-nearby__footer">
                  <button type="button" className="chef-nearby__button" onClick={() => openArea(item.name)}>
                    Open Area
                  </button>
                  <span className="chef-nearby__arrow">›</span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ChefNearby;
