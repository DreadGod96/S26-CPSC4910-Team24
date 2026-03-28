import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./Catalogue.css";

const BASE_URL =
  process.env.REACT_APP_DOMINOS_URL ||
  "http://localhost:3005/api/dominos";

const MENU_URL = `${BASE_URL}/get_menu`;
const IMAGE_URL = (code) => `${BASE_URL}/item_image/${encodeURIComponent(code)}`;
const CART_URL = `${BASE_URL}/cart`;

const PIZZA_EMOJI = ["🍕", "🧀", "🥩", "🌶️", "🫑", "🧅", "🍗", "🥓"];

const CATEGORIES = ["All", "Pizza", "Breads", "Drinks", "Desserts"];

function getItemCategory(name) {
  const n = name.toLowerCase();
  if (
    n.includes("coke") || n.includes("sprite") || n.includes("pepsi") ||
    n.includes("dr pepper") || n.includes("water") || n.includes("lemonade") ||
    n.includes("juice") || n.includes("drink") || n.includes("soda") ||
    n.includes("2-liter") || n.includes("bottle")
  ) return "Drinks";
  if (
    n.includes("lava") || n.includes("brownie") || n.includes("marble cookie") ||
    n.includes("cinna") || n.includes("dessert") || n.includes("cake")
  ) return "Desserts";
  if (
    n.includes("bread") || n.includes("twist") || n.includes("knot") ||
    n.includes("parmesan") || n.includes("stuffed cheesy")
  ) return "Breads";
  if (
    n.includes("pizza") || n.includes("feast") || n.includes("extravaganza") ||
    n.includes("supreme") || n.includes("pepperoni") || n.includes("veggie") ||
    n.includes("chicken bacon") || n.includes("philly")
  ) return "Pizza";
  return "Other";
}

function cardEmoji(index) {
  return PIZZA_EMOJI[index % PIZZA_EMOJI.length];
}

// Always pass item.code — the backend resolves imageCode from its menu cache.
function ItemImage({ code, alt, emojiIndex }) {
  const [imgState, setImgState] = useState("loading"); // "loading" | "loaded" | "error"

  return (
    <div className="item-card__img-wrap">
      {imgState === "loading" && (
        <div className="item-card__img-skeleton" />
      )}
      {imgState === "error" ? (
        <div className="item-card__img-fallback">{cardEmoji(emojiIndex)}</div>
      ) : (
        <img
          className="item-card__img"
          src={IMAGE_URL(code)}
          alt={alt}
          style={imgState === "loading" ? { display: "none" } : {}}
          onLoad={() => setImgState("loaded")}
          onError={() => {
            console.warn(`[Catalogue] Image failed to load for item code: ${code}`);
            setImgState("error");
          }}
        />
      )}
    </div>
  );
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

function CartDrawer({ cart, onRemove, onUpdateQty, onSubmit, submitting, submitResult, onClose }) {
  const total = cart.items.reduce((sum, item) => {
    return sum + (parseFloat(item.price) || 0) * item.quantity;
  }, 0);

  return (
    <div className="cart-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="cart-drawer">
        <div className="cart-drawer__header">
          <h2 className="cart-drawer__title">Your Cart</h2>
          <button className="cart-drawer__close" onClick={onClose} aria-label="Close cart">✕</button>
        </div>

        {cart.items.length === 0 ? (
          <div className="cart-empty">
            <span className="cart-empty__icon">🛒</span>
            <p>Your cart is empty. Add items to get started!</p>
          </div>
        ) : (
          <>
            <ul className="cart-items">
              {cart.items.map((item) => (
                <li className="cart-item" key={item.code}>
                  <div className="cart-item__info">
                    <span className="cart-item__name">{item.name}</span>
                    <span className="cart-item__price">
                      {item.price ? `${Math.round(parseFloat(item.price) * 100)} pts` : "—"}
                    </span>
                  </div>
                  <div className="cart-item__controls">
                    <button
                      className="cart-item__qty-btn"
                      onClick={() => onUpdateQty(item.code, item.quantity - 1)}
                      disabled={submitting}
                      aria-label="Decrease quantity"
                    >−</button>
                    <span className="cart-item__qty">{item.quantity}</span>
                    <button
                      className="cart-item__qty-btn"
                      onClick={() => onUpdateQty(item.code, item.quantity + 1)}
                      disabled={submitting}
                      aria-label="Increase quantity"
                    >+</button>
                    <button
                      className="cart-item__remove"
                      onClick={() => onRemove(item.code)}
                      disabled={submitting}
                      aria-label={`Remove ${item.name}`}
                    >🗑</button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="cart-total">
              <span>Total</span>
              <span className="cart-total__amount">{Math.round(total * 100)} pts</span>
            </div>

            {submitResult && (
              <div className={`cart-result cart-result--${submitResult.type}`}>
                {submitResult.message}
              </div>
            )}

            <button
              className="cart-submit-btn"
              onClick={onSubmit}
              disabled={submitting}
            >
              {submitting ? "Placing Order…" : "Checkout"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function Catalogue() {
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [pointMode, setPointMode] = useState("any"); // "any" | "exact" | "range"
  const [pointExact, setPointExact] = useState("");
  const [pointMin, setPointMin] = useState("");
  const [pointMax, setPointMax] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const { user } = useAuth();
  const navigate = useNavigate();

  // Cart state
  const [cartId, setCartId] = useState(null);
  const [cart, setCart] = useState({ items: [], itemCount: 0 });
  const [cartOpen, setCartOpen] = useState(false);
  const [addingToCart, setAddingToCart] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  // Initialize cart session on mount
  useEffect(() => {
    async function initCart() {
      try {
        const res = await fetch(CART_URL, { method: "POST" });
        const data = await res.json();
        setCartId(data.cartId);
      } catch (err) {
        console.error("[Catalogue] Failed to create cart:", err);
      }
    }
    initCart();
  }, []);

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

  async function handleAddToCart(item) {
    if (!cartId) return;
    setAddingToCart((s) => ({ ...s, [item.code]: true }));
    try {
      const res = await fetch(`${CART_URL}/${cartId}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: item.code, quantity: 1 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCart(data);
    } catch (err) {
      console.error("[Catalogue] Add to cart failed:", err);
    } finally {
      setAddingToCart((s) => ({ ...s, [item.code]: false }));
    }
  }

  async function handleUpdateQty(code, quantity) {
    if (!cartId) return;
    if (quantity <= 0) {
      handleRemove(code);
      return;
    }
    try {
      const res = await fetch(`${CART_URL}/${cartId}/item/${encodeURIComponent(code)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCart(data);
    } catch (err) {
      console.error("[Catalogue] Update quantity failed:", err);
    }
  }

  async function handleRemove(code) {
    if (!cartId) return;
    try {
      const res = await fetch(`${CART_URL}/${cartId}/item/${encodeURIComponent(code)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCart(data);
    } catch (err) {
      console.error("[Catalogue] Remove from cart failed:", err);
    }
  }

  async function handleSubmit() {
    if (!cartId || cart.items.length === 0) return;
    setSubmitting(true);
    setSubmitResult(null);
    try {
      const res = await fetch(`${CART_URL}/${cartId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: {
            street: "101 Calhoun Dr",
            city: "Clemson",
            region: "SC",
            postalCode: "29634",
          },
          customer: {
            firstName: "Tiger",
            lastName: "Points",
            email: "tigerpoints@clemson.edu",
            phone: "8645550000",
          },
          payment: "cash",
          userId: user?.user?.id ?? user?.id ?? null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCart({ items: [], itemCount: 0 });
      setSubmitResult({ type: "success", message: `Order placed! Confirmation: ${data.orderId}` });
    } catch (err) {
      setSubmitResult({ type: "error", message: err.message || "Checkout failed. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  const filtered = (menu?.specialtyItems ?? []).filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.description || "").toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" || getItemCategory(item.name) === categoryFilter;

    const pts = item.price ? Math.round(parseFloat(item.price) * 100) : null;
    let matchesPoints = true;
    if (pointMode === "exact" && pointExact !== "") {
      matchesPoints = pts !== null && pts === parseInt(pointExact, 10);
    } else if (pointMode === "range") {
      if (pointMin !== "") matchesPoints = matchesPoints && pts !== null && pts >= parseInt(pointMin, 10);
      if (pointMax !== "") matchesPoints = matchesPoints && pts !== null && pts <= parseInt(pointMax, 10);
    }

    return matchesSearch && matchesCategory && matchesPoints;
  });

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
              <div className="store-bar__right">
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
                <button
                  className="cart-fab"
                  onClick={() => setCartOpen(true)}
                  aria-label="Open cart"
                >
                  🛒 Cart
                  {cart.itemCount > 0 && (
                    <span className="cart-badge">{cart.itemCount}</span>
                  )}
                </button>
              </div>
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

              <div className="filter-bar">
                <div className="filter-group">
                  <span className="filter-label">Points</span>
                  <div className="filter-point-modes">
                    {["any", "exact", "range"].map((mode) => (
                      <button
                        key={mode}
                        className={`filter-mode-btn${pointMode === mode ? " filter-mode-btn--active" : ""}`}
                        onClick={() => { setPointMode(mode); setPointExact(""); setPointMin(""); setPointMax(""); }}
                        type="button"
                      >
                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                      </button>
                    ))}
                  </div>
                  {pointMode === "exact" && (
                    <input
                      className="filter-point-input"
                      type="number"
                      min="0"
                      placeholder="e.g. 100"
                      value={pointExact}
                      onChange={(e) => setPointExact(e.target.value)}
                    />
                  )}
                  {pointMode === "range" && (
                    <div className="filter-range">
                      <input
                        className="filter-point-input"
                        type="number"
                        min="0"
                        placeholder="Min pts"
                        value={pointMin}
                        onChange={(e) => setPointMin(e.target.value)}
                      />
                      <span className="filter-range-sep">–</span>
                      <input
                        className="filter-point-input"
                        type="number"
                        min="0"
                        placeholder="Max pts"
                        value={pointMax}
                        onChange={(e) => setPointMax(e.target.value)}
                      />
                    </div>
                  )}
                </div>

                <div className="filter-group">
                  <span className="filter-label">Category</span>
                  <div className="filter-category-btns">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        className={`filter-cat-btn${categoryFilter === cat ? " filter-cat-btn--active" : ""}`}
                        onClick={() => setCategoryFilter(cat)}
                        type="button"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {(search || pointMode !== "any" || categoryFilter !== "All") && (
                  <button
                    className="filter-clear-btn"
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setPointMode("any");
                      setPointExact("");
                      setPointMin("");
                      setPointMax("");
                      setCategoryFilter("All");
                    }}
                  >
                    ✕ Clear Filters
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
                    const isAdding = addingToCart[item.code] ?? false;
                    return (
                      <div className="item-card" key={item.code}>
                        <ItemImage code={item.code} alt={item.name} emojiIndex={i} />
                        <div className="item-card__body">
                          <h3 className="item-card__name">{item.name}</h3>
                          {item.description && (
                            <p className="item-card__desc">{item.description}</p>
                          )}
                        </div>
                        <button
                          className="item-card__btn"
                          onClick={() =>
                            navigate(`/product/${item.code}`, { state: { item } })
                          }
                        >
                          View Details
                        </button>
                        <div className="item-card__footer">
                          <span className="item-card__price">
                            {item.price
                              ? `${Math.round(parseFloat(item.price) * 100)} pts`
                              : "—"}
                          </span>
                          <button
                            className="item-card__btn item-card__btn--cart"
                            onClick={() => handleAddToCart(item)}
                            disabled={isAdding || !cartId}
                          >
                            {isAdding ? "Adding…" : "+ Cart"}
                          </button>
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

      {cartOpen && (
        <CartDrawer
          cart={cart}
          onRemove={handleRemove}
          onUpdateQty={handleUpdateQty}
          onSubmit={handleSubmit}
          submitting={submitting}
          submitResult={submitResult}
          onClose={() => { setCartOpen(false); setSubmitResult(null); }}
        />
      )}
    </div>
  );
}
