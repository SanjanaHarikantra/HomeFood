import { useState } from "react";
import "../styles/Chef.css";

type ChefMenuItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  category: string;
  available: boolean;
  image: string;
};

type ChefMenuProps = {
  items: ChefMenuItem[];
  onToggleAvailability: (itemId: string) => void;
  onAddItem: (name: string, category: string, price: string, description: string, image: string) => void;
  onUpdateItem: (
    itemId: string,
    updates: { name: string; category: string; price: string; description: string; image: string }
  ) => void;
  onDeleteItem: (itemId: string) => void;
};

const ChefMenu = ({ items, onToggleAvailability, onAddItem, onUpdateItem, onDeleteItem }: ChefMenuProps) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const readImage = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAdd = () => {
    if (editingId) {
      onUpdateItem(editingId, { name, category, price, description, image });
      setEditingId(null);
    } else {
      onAddItem(name, category, price, description, image);
    }
    setName("");
    setCategory("");
    setPrice("");
    setDescription("");
    setImage("");
  };

  const startEdit = (item: ChefMenuItem) => {
    setEditingId(item.id);
    setName(item.name);
    setCategory(item.category);
    setPrice(item.price.replace(/[^\d.]/g, ""));
    setDescription(item.description);
    setImage(item.image);
  };

  return (
    <section className="chef-page chef-menu-page">
      <div className="chef-page__wrap chef-menu__wrap">
        <article className="chef-page__hero chef-menu__hero">
          <p className="chef-page__eyebrow">Menu Management</p>
          <h1>Update dishes and availability</h1>
          <p>Set pricing, stock, and menu visibility for your kitchen.</p>
        </article>

        <article className="chef-page__card chef-menu__editor">
          <div className="chef-menu__editor-top">
            <span className="chef-page__tag">{editingId ? "Update Dish" : "Add New Item"}</span>
            <span className="chef-menu__editor-pill">Quick add</span>
          </div>

          <div className="chef-menu__grid">
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Dish name" />
            <input value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Category" />
            <input value={price} onChange={(event) => setPrice(event.target.value)} placeholder="Price" />
            <input value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Description" />
          </div>

          <div className="chef-menu__upload-grid">
            <label className="chef-menu__upload-card">
              <span>Add from computer</span>
              <input type="file" accept="image/*" onChange={(event) => readImage(event.target.files?.[0] || null)} />
            </label>
            <label className="chef-menu__upload-card">
              <span>Click photo</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(event) => readImage(event.target.files?.[0] || null)}
              />
            </label>
          </div>

          <div className="chef-menu__actions">
            <button type="button" className="chef-page__button chef-menu__submit" onClick={handleAdd}>
              {editingId ? "Update Item" : "Add Item"}
            </button>
          </div>

          {image && (
            <img className="chef-page__preview chef-page__preview--menu chef-menu__preview" src={image} alt={name || "Dish preview"} />
          )}
        </article>

        <div className="chef-menu__section-head">
          <h2>Active Menu</h2>
          <div className="chef-menu__view-switch" aria-hidden="true">
            <span>◫</span>
            <span>☰</span>
          </div>
        </div>

        <div className="chef-menu__cards">
          {items.map((item, index) => (
            <article
              key={item.id}
              className="chef-menu__card chef-menu__card--animated"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <div className="chef-menu__image-wrap">
                <img className="chef-menu__image" src={item.image} alt={item.name} />
              </div>
              <div className="chef-menu__copy">
                <div className="chef-menu__row">
                  <strong>{item.name}</strong>
                  <span className="chef-page__tag chef-menu__price">{item.price}</span>
                </div>
                <p>{item.description}</p>
                <p className="chef-menu__meta">
                  {item.category} • {item.stock} left
                </p>
                <div className="chef-menu__status-row">
                  <span className={`chef-menu__status ${item.available ? "is-live" : "is-hidden"}`}>
                    {item.available ? "Live" : "Hidden"}
                  </span>
                  <button
                    type="button"
                    className="chef-page__button chef-page__button--light chef-menu__action"
                    onClick={() => onToggleAvailability(item.id)}
                  >
                    {item.available ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <div className="chef-menu__footer-actions">
                <button type="button" className="chef-page__button chef-page__button--light chef-menu__action" onClick={() => startEdit(item)}>
                  Update
                </button>
                <button type="button" className="chef-page__button chef-page__button--danger chef-menu__action" onClick={() => onDeleteItem(item.id)}>
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChefMenu;
