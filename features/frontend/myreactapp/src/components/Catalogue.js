import React from "react";
import "./Catalogue.css";

import pepperoni from "../components/pizzas/pepperoni.jpg";
import deluxe from "../components/pizzas/deluxe.jpg";
import meatzza from "../components/pizzas/meatzza.jpg";
import veggie from "../components/pizzas/veggie.jpg";

export default function Catalogue() {

const mockItems = [
  { id: 1, title: "Pepperoni", price: "$14.99", image: pepperoni },
  { id: 2, title: "Deluxe", price: "$16.99", image: deluxe },
  { id: 3, title: "MeatZZa", price: "$17.99", image: meatzza },
  { id: 4, title: "Pacific Veggie", price: "$15.99", image: veggie },
];

  return (
    <div className="catalogue-page">
      <div className="catalogue-container">

        <h2 className="catalogue-title">Domino's Catalogue</h2>

        <div className="catalogue-grid">
          {mockItems.map((item) => (
            <div key={item.id} className="catalogue-card">
              
              <img
                src={item.image}
                alt={item.title}
                className="catalogue-image"
              />

              <div className="catalogue-card-body">
                <h3>{item.title}</h3>
                <p>{item.price}</p>
                <button className="catalogue-button">
                  View
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}