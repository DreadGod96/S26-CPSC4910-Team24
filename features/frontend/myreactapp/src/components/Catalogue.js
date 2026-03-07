import { useState, useEffect } from "react";
import "./Catalogue.css";

const BASE_URL =
  process.env.REACT_APP_DOMINOS_URL ||
  "http://localhost:3005/api/dominos";

const MENU_URL = `${BASE_URL}/get_menu`;
const ORDER_URL = `${BASE_URL}/place_order`;
const IMAGE_URL = (code) => `${BASE_URL}/item_image/${encodeURIComponent(code)}`;

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
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  // Per-item order state: code -> "idle" | "ordering" | "ordered" | "error"
  const [orderState, setOrderState] = useState({});

  useEffect(() => {
    async function fetchMenu() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(MENU_URL);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setMenu(data);
      } catch (err) {
        setError(err.message || "Failed to load menu. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchMenu();
  }, []);

  async function handleRedeem(item) {
    setOrderState((s) => ({ ...s, [item.code]: "ordering" }));
    try {
      const res = await fetch(ORDER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: {
          street: "101 Calhoun Dr",
          city: "Clemson",
          region: "SC",
          postalCode: "29634",
          },
          items: [{ code: item.code, quantity: 1 }],
          customer: {
            firstName: "Tiger",
            lastName: "Points",
            email: "tigerpoints@clemson.edu",
            phone: "8645550000",
          },
          payment: "cash",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOrderState((s) => ({ ...s, [item.code]: "ordered" }));
    } catch {
      setOrderState((s) => ({ ...s, [item.code]: "error" }));
    }
  }

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
            Nearest store to Clemson University — browse and redeem with your points
          </p>
        </header>

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
                  {filtered.map((item, i) => {
                    const state = orderState[item.code] ?? "idle";
                    return (
                      <div className="item-card" key={item.code}>
                        <img
                          className="item-card__img"
                          src={IMAGE_URL(item.code)}
                          alt={item.name}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.nextSibling.style.display = "block";
                          }}
                        />
                        <div className="item-card__icon" style={{ display: "none" }}>{cardEmoji(i)}</div>
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
                          {state === "ordered" ? (
                            <span className="item-card__ordered">Order placed!</span>
                          ) : state === "error" ? (
                            <button
                              className="item-card__btn item-card__btn--error"
                              onClick={() => handleRedeem(item)}
                            >
                              Retry
                            </button>
                          ) : (
                            <button
                              className="item-card__btn"
                              onClick={() => handleRedeem(item)}
                              disabled={state === "ordering"}
                            >
                              {state === "ordering" ? "…" : "Redeem"}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}

      </div>
    </div>
  );
}
