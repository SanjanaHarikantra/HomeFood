import "../styles/VoiceOrder.css";

const VoiceOrder = () => {
  return (
    <div className="voice card">
      <div>
        <h3>Voice Ordering</h3>
        <p className="muted">"Hey DabbaWala, order my usual."</p>
      </div>
      <button className="btn">Activate Mic</button>
    </div>
  );
};

export default VoiceOrder;
