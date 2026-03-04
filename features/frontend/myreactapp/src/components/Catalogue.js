import { useState } from "react";
import "./Catalogue.css";

const DOMINOS_URL =
  process.env.REACT_APP_DOMINOS_URL ||
  "http://localhost:3003/api/dominos/get_menu";

const PIZZA_EMOJI = ["🍕", "🧀", "🥩", "🌶️", "🫑", "🧅", "🍗", "🥓"];

function cardEmoji(index) {
  return PIZZA_EMOJI[index % PIZZA_EMOJI.length];
}

function SkeletonGrid() {
  return (
    <div className="items-grid">
      {[...Array(6)].map((_, i) => (
        <div className="item-card item-card--skeleton" key={i}>
          <div className="skeleton-icon" />
          <div className="skeleton-body">
            <div className="skeleton-line skeleton-line--long" />
            <div className="skeleton-line skeleton-line--medium" />
            <div className="skeleton-line skeleton-line--short" />
          </div>
          <div className="skeleton-footer">
            <div className="skeleton-line skeleton-line--price" />
            <div className="skeleton-line skeleton-line--btn" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Catalogue() {
  const [form, setForm] = useState({
    street: "",
    city: "",
    region: "",
    postalCode: "",
  });
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMenu(null);
    setSearch("");
    try {
      const res = await fetch(DOMINOS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMenu(data);
    } catch (err) {
      setError(err.message || "Failed to load menu. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filtered =
    menu?.specialtyItems?.filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        (item.description || "").toLowerCase().includes(search.toLowerCase())
    ) ?? [];

  return (
    <div className="catalogue-page">
      <div className="catalogue-container">

        <header className="catalogue-header">
          <h1 className="catalogue-title">Domino's Menu</h1>
          <p className="catalogue-subtitle">
            Enter your address to find the nearest store and browse the full menu
          </p>
        </header>

        <form className="address-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-field form-field--street">
              <label className="form-label">Street</label>
              <input
                className="form-input"
                name="street"
                value={form.street}
                onChange={handleChange}
                placeholder="900 Clark Ave"
                required
              />
            </div>
            <div className="form-field form-field--city">
              <label className="form-label">City</label>
              <input
                className="form-input"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="St. Louis"
                required
              />
            </div>
            <div className="form-field form-field--short">
              <label className="form-label">State</label>
              <input
                className="form-input"
                name="region"
                value={form.region}
                onChange={handleChange}
                placeholder="MO"
                maxLength={2}
                required
              />
            </div>
            <div className="form-field form-field--short">
              <label className="form-label">ZIP</label>
              <input
                className="form-input"
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                placeholder="63102"
                required
              />
            </div>
          </div>
          <button className="form-submit" type="submit" disabled={loading}>
            {loading ? (
              <span className="btn-loading">
                <span className="btn-spinner" /> Searching…
              </span>
            ) : (
              "Find My Store"
            )}
          </button>
        </form>

        {error && (
          <div className="catalogue-error">
            <span className="error-icon">⚠</span> {error}
          </div>
        )}

        {loading && <SkeletonGrid />}

        {menu && !loading && (
          <>
            <div className="store-bar">
              <div className="store-info">
                <span className="store-pin">📍</span>
                <span className="store-name">{menu.storeName}</span>
              </div>
              <span
                className={`status-badge ${
                  menu.fromCache
                    ? "status-badge--cached"
                    : menu.isOpen
                    ? "status-badge--open"
                    : "status-badge--closed"
                }`}
              >
                <span className="status-dot" />
                {menu.fromCache
                  ? "Cached Menu"
                  : menu.isOpen
                  ? "Open Now"
                  : "Closed"}
              </span>
            </div>

            <section className="items-section">
              <div className="section-header">
                <h2 className="section-title">Specialty Items</h2>
                <span className="section-count">
                  {menu.specialtyItems.length} items
                </span>
              </div>

              <div className="search-bar">
                <span className="search-icon">🔍</span>
                <input
                  className="search-input"
                  type="text"
                  placeholder="Search items…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button
                    className="search-clear"
                    onClick={() => setSearch("")}
                    type="button"
                  >
                    ✕
                  </button>
                )}
              </div>

              {filtered.length === 0 ? (
                <div className="no-results">
                  <span className="no-results-icon">🔎</span>
                  <p>No items match &ldquo;{search}&rdquo;</p>
                </div>
              ) : (
                <div className="items-grid">
                  {filtered.map((item, i) => (
                    <div className="item-card" key={item.code}>
                      <div className="item-card__icon">{cardEmoji(i)}</div>
                      <div className="item-card__body">
                        <h3 className="item-card__name">{item.name}</h3>
                        {item.description && (
                          <p className="item-card__desc">{item.description}</p>
                        )}
                      </div>
                      <div className="item-card__footer">
                        <span className="item-card__price">
                          {item.price
                            ? `$${parseFloat(item.price).toFixed(2)}`
                            : "—"}
                        </span>
                        <button className="item-card__btn">Redeem</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

      </div>
    </div>
  );
}
