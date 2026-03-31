import React from "react";
import { useNavigate } from "react-router-dom";
import "./DashBoard.css";

const orders = [
  { id: "ORD-1042", date: "12/18/25", driver: "Jane Smith", item: "Pepperoni Pizza (L)", points: 2500, status: "Delivered" },
  { id: "ORD-1031", date: "12/05/25", driver: "Bob Jones", item: "Pasta Primavera", points: 1800, status: "Delivered" },
  { id: "ORD-1020", date: "11/22/25", driver: "Alice Chen", item: "BBQ Chicken Pizza (M)", points: 2000, status: "Delivered" },
  { id: "ORD-1009", date: "11/10/25", driver: "Tom Rivera", item: "Cheesy Bread", points: 900, status: "Cancelled" },
];

const statusColor = { Delivered: "#2e7d32", Cancelled: "#c62828" };

export default function OrderHistory() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-page">
      <div className="dashboard">
        <div className="welcome">
          Order History
          <span className="subtitle">Past driver redemptions</span>
        </div>

        <button
          className="btn btn-sm"
          style={{ marginBottom: "1rem", alignSelf: "flex-start" }}
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: "8px", overflow: "hidden" }}>
          <thead>
            <tr style={{ background: "#4a90d9", color: "#fff" }}>
              <th style={{ padding: "12px 16px", textAlign: "left" }}>Order ID</th>
              <th style={{ padding: "12px 16px", textAlign: "left" }}>Date</th>
              <th style={{ padding: "12px 16px", textAlign: "left" }}>Driver</th>
              <th style={{ padding: "12px 16px", textAlign: "left" }}>Item</th>
              <th style={{ padding: "12px 16px", textAlign: "right" }}>Points</th>
              <th style={{ padding: "12px 16px", textAlign: "left" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "12px 16px", fontFamily: "monospace" }}>{o.id}</td>
                <td style={{ padding: "12px 16px" }}>{o.date}</td>
                <td style={{ padding: "12px 16px" }}>{o.driver}</td>
                <td style={{ padding: "12px 16px" }}>{o.item}</td>
                <td style={{ padding: "12px 16px", textAlign: "right" }}>{o.points.toLocaleString()}</td>
                <td style={{ padding: "12px 16px", fontWeight: 600, color: statusColor[o.status] }}>{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
