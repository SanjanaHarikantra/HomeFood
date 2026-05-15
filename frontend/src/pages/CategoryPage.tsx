import "../styles/CategoryPage.css";

interface CategoryPageProps {
  title: string;
  description: string;
  helper?: string;
}

const CategoryPage = ({ title, description, helper }: CategoryPageProps) => {
  return (
    <section className="section category-page">
      <div className="category-page__card">
        <h1>{title}</h1>
        <p>{description}</p>
        {helper && <p className="category-page__helper">{helper}</p>}
        <button className="btn" type="button" onClick={() => window.history.back()}>
          Back
        </button>
      </div>
    </section>
  );
};

export default CategoryPage;
