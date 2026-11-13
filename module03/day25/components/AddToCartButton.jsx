"use client";
import { useCart } from "./CartContext";
import { useState } from "react";

export default function AddToCartButton({ dish }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(dish);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      className={`btn ${added ? "btn-success" : "btn-primary"} btn-sm`}
      style={{
        minWidth: "120px",
        minHeight: "44px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {added ? "✓ Added" : "+ Add to Cart"}
    </button>
  );
}
