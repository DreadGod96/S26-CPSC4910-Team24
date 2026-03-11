import { useParams, useLocation } from "react-router-dom";

export default function ProductDetails() {
  const { code } = useParams();
  const location = useLocation();
  const item = location.state?.item;

  return (
    <div style={{ paddingTop: "120px", textAlign: "center" }}>
      <h1>Product Details</h1>

      <p><strong>Code:</strong> {code}</p>

      {item && (
        <>
          <h2>{item.name}</h2>
          <p>{item.description}</p>
          <p>
            <strong>Price:</strong>{" "}
            {item.price ? `$${parseFloat(item.price).toFixed(2)}` : "—"}
          </p>
        </>
      )}
    </div>
  );
}