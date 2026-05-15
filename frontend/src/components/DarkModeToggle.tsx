import "../styles/DarkModeToggle.css";

const DarkModeToggle = () => {
  const toggle = () => {
    document.documentElement.classList.toggle("dark");
  };

  return (
    <button className="dark-toggle" onClick={toggle} aria-label="Toggle Dark Mode">
      <span>🌙</span>
    </button>
  );
};

export default DarkModeToggle;
