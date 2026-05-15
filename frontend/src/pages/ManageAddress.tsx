import { useMemo, useState } from "react";
import "../styles/ManageAddress.css";

export type AddressType = "Home" | "Work" | "Other";

export type SavedAddress = {
  id: string;
  type: AddressType;
  fullAddress: string;
  name: string;
  phone: string;
  city: string;
  pincode: string;
  isDefault?: boolean;
};

type AddressFormState = {
  id?: string;
  type: AddressType;
  name: string;
  phone: string;
  house: string;
  area: string;
  city: string;
  pincode: string;
};

interface ManageAddressProps {
  addresses: SavedAddress[];
  selectedAddressId: string | null;
  onSelectAddress: (id: string) => void;
  onSaveAddress: (address: SavedAddress) => Promise<void> | void;
  onDeleteAddress: (id: string) => void;
}

const emptyForm: AddressFormState = {
  type: "Home",
  name: "",
  phone: "",
  house: "",
  area: "",
  city: "",
  pincode: "",
};

const typeIcon: Record<AddressType, string> = {
  Home: "🏠",
  Work: "🏢",
  Other: "📍",
};

const parseIntoForm = (address: SavedAddress): AddressFormState => {
  const parts = address.fullAddress.split(",").map((item) => item.trim());
  return {
    id: address.id,
    type: address.type,
    name: address.name,
    phone: address.phone,
    house: parts[0] ?? "",
    area: parts[1] ?? "",
    city: address.city,
    pincode: address.pincode,
  };
};

const ManageAddress = ({
  addresses,
  selectedAddressId,
  onSelectAddress,
  onSaveAddress,
  onDeleteAddress,
}: ManageAddressProps) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<AddressFormState>(emptyForm);
  const [error, setError] = useState("");

  const selectedAddress = useMemo(
    () => addresses.find((item) => item.id === selectedAddressId) ?? null,
    [addresses, selectedAddressId]
  );

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    window.location.hash = "#profile";
  };

  const openNewForm = () => {
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  };

  const openEditForm = (address: SavedAddress) => {
    setForm(parseIntoForm(address));
    setError("");
    setShowForm(true);
  };

  const handleUseCurrentLocation = () => {
    const detected = {
      house: "Block C4/139",
      area: "Mehndi Wala Park, Keshav Puram",
      city: "New Delhi",
      pincode: "110035",
    };
    setForm((prev) => ({ ...prev, ...detected }));
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.phone.trim() || !form.house.trim() || !form.area.trim() || !form.city.trim() || !form.pincode.trim()) {
      setError("Please fill all required fields.");
      return;
    }
    if (form.phone.trim().length < 10) {
      setError("Enter a valid phone number.");
      return;
    }

    const nextId = form.id ?? `addr-${Date.now()}`;
    const fullAddress = `${form.house.trim()}, ${form.area.trim()}`;
    try {
      await onSaveAddress({
        id: nextId,
        type: form.type,
        fullAddress,
        name: form.name.trim(),
        phone: form.phone.trim(),
        city: form.city.trim(),
        pincode: form.pincode.trim(),
        isDefault: selectedAddressId ? undefined : true,
      });
      setShowForm(false);
      setForm(emptyForm);
      setError("");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save address.");
    }
  };

  return (
    <section className="section manage-address-page">
      <header className="manage-address-page__topbar">
        <button type="button" className="manage-address-page__back" onClick={handleBack} aria-label="Go back">
          &lt;
        </button>
        <h1>My Addresses</h1>
      </header>

      {addresses.length === 0 && !showForm ? (
        <section className="manage-address-page__empty">
          <div className="manage-address-page__empty-ill" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <h3>No address saved yet</h3>
          <button type="button" onClick={openNewForm}>Add New Address</button>
        </section>
      ) : (
        <section className="manage-address-page__list">
          {addresses.map((address) => {
            const isSelected = selectedAddressId === address.id;
            return (
              <article key={address.id} className={`manage-address-page__card ${isSelected ? "is-selected" : ""}`}>
                <div className="manage-address-page__card-top">
                  <strong>{typeIcon[address.type]} {address.type}</strong>
                  {address.isDefault && <span className="manage-address-page__default">Default</span>}
                </div>
                <p>{address.fullAddress}, {address.city} - {address.pincode}</p>
                <small>{address.name} • {address.phone}</small>
                <div className="manage-address-page__actions">
                  <button type="button" onClick={() => openEditForm(address)}>✏️ Edit</button>
                  <button type="button" onClick={() => onDeleteAddress(address.id)}>🗑️ Delete</button>
                  <button type="button" className="is-select" onClick={() => onSelectAddress(address.id)}>
                    {isSelected ? "✅ Selected" : "✔️ Select"}
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {showForm && (
        <section className="manage-address-page__form">
          <h3>{form.id ? "Edit Address" : "Add New Address"}</h3>
          <div className="manage-address-page__type">
            {(["Home", "Work", "Other"] as AddressType[]).map((type) => (
              <button
                key={type}
                type="button"
                className={form.type === type ? "is-active" : ""}
                onClick={() => setForm((prev) => ({ ...prev, type }))}
              >
                {typeIcon[type]} {type}
              </button>
            ))}
          </div>
          <input placeholder="Name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          <input placeholder="Phone Number" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
          <input placeholder="House / Flat / Building" value={form.house} onChange={(e) => setForm((p) => ({ ...p, house: e.target.value }))} />
          <input placeholder="Area / Street" value={form.area} onChange={(e) => setForm((p) => ({ ...p, area: e.target.value }))} />
          <div className="manage-address-page__split">
            <input placeholder="City" value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} />
            <input placeholder="Pincode" value={form.pincode} onChange={(e) => setForm((p) => ({ ...p, pincode: e.target.value }))} />
          </div>
          <div className="manage-address-page__map">
            <button type="button" onClick={handleUseCurrentLocation}>📍 Use Current Location</button>
            <div>Map Picker (drag pin) • Demo</div>
          </div>
          {error && <p className="manage-address-page__error">{error}</p>}
          <div className="manage-address-page__form-actions">
            <button type="button" className="ghost" onClick={() => setShowForm(false)}>Cancel</button>
            <button type="button" className="save" onClick={handleSave}>Save Address</button>
          </div>
        </section>
      )}

      {!showForm && (
        <button type="button" className="manage-address-page__sticky-add" onClick={openNewForm}>
          + Add New Address
        </button>
      )}

      {selectedAddress && (
        <div className="manage-address-page__selected-note">
          Selected for checkout: {selectedAddress.type} • {selectedAddress.fullAddress}
        </div>
      )}
    </section>
  );
};

export default ManageAddress;
