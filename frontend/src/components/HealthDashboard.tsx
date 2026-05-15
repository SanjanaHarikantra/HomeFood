import "../styles/HealthDashboard.css";

const HealthDashboard = () => {
  return (
    <div className="health card">
      <div className="health__summary">
        <h3>Weekly Nutrition</h3>
        <p className="muted">Balanced macros with smart reminders</p>
        <div className="health__stats">
          <div>
            <h4>1,820 kcal</h4>
            <p className="muted">Avg daily</p>
          </div>
          <div>
            <h4>5 days</h4>
            <p className="muted">Healthy streak</p>
          </div>
          <div>
            <h4>2.4L</h4>
            <p className="muted">Water reminder</p>
          </div>
        </div>
      </div>
      <div className="health__graph">
        <div className="bar" style={{ height: "60%" }} />
        <div className="bar" style={{ height: "80%" }} />
        <div className="bar" style={{ height: "55%" }} />
        <div className="bar" style={{ height: "90%" }} />
        <div className="bar" style={{ height: "70%" }} />
        <div className="badge">Healthy Streak 🏅</div>
      </div>
    </div>
  );
};

export default HealthDashboard;
