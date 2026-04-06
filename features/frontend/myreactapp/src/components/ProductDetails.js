import { useParams, useLocation, Link } from "react-router-dom";
import { useState } from "react";
import "./ProductDetails.css";

const BASE_URL =
  process.env.REACT_APP_DOMINOS_URL ||
  "http://localhost:3005/api/dominos";

const IMAGE_URL = (code) => `${BASE_URL}/item_image/${encodeURIComponent(code)}`;

export default function ProductDetails() {
  const { code } = useParams();
  const location = useLocation();
  const item = location.state?.item;
  const [imgState, setImgState] = useState("loading");

  const formattedPrice =
    item?.price ? `${Math.round(parseFloat(item.price) * 100)} pts` : "—";

  return (
    <div className="product-details-page">
      <div className="product-details-container">
        <Link to="/catalogue" className="product-details-back">
          ← Back to Catalogue
        </Link>

        <div className="product-details-card">
          <div className="product-details-hero">
            <div className="product-details-badge">Catalogue Item</div>
            <h1 className="product-details-title">
              {item?.name || "Product Details"}
            </h1>
            <p className="product-details-subtitle">
              View the full item information before ordering.
            </p>
          </div>

          <div className="product-details-content">
            <div className="product-details-main">
              <div className="product-details-image-card">
                {imgState === "loading" && (
                  <div className="product-details-image-skeleton" />
                )}

                {imgState === "error" ? (
                  <div className="product-details-image-fallback">🍕</div>
                ) : (
                  <img
                    className="product-details-image"
                    src={IMAGE_URL(code)}
                    alt={item?.name || "Catalogue item"}
                    style={imgState === "loading" ? { display: "none" } : {}}
                    onLoad={() => setImgState("loaded")}
                    onError={() => setImgState("error")}
                  />
                )}
              </div>

              <section className="product-details-section">
                <h2 className="product-details-section-title">Description</h2>
                <p className="product-details-description">
                  {item?.description || "No description available for this item."}
                </p>
              </section>
            </div>

            <aside className="product-details-sidebar">
              <div className="product-details-info-card">
                <h2 className="product-details-info-title">Item Info</h2>

                <div className="product-details-info-row">
                  <span className="product-details-label">Code</span>
                  <span className="product-details-value">{code}</span>
                </div>

                <div className="product-details-info-row">
                  <span className="product-details-label">Name</span>
                  <span className="product-details-value">
                    {item?.name || "—"}
                  </span>
                </div>

                <div className="product-details-info-row">
                  <span className="product-details-label">Price</span>
                  <span className="product-details-price">{formattedPrice}</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}