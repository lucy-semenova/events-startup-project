import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import api from "../../services/api";
import "./CheckoutPage.css";

export default function CheckoutPage({ onLoginClick }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) {
    return (
      <main className="checkoutPage">
        <h1>Checkout</h1>
        <Link to="/" className="backLink">
          ← Back to events
        </Link>
        <p>You need to log in before checkout.</p>
        <button className="primaryButton" onClick={onLoginClick}>
          Go to login
        </button>
      </main>
    );
  }

  if (cartItems.length === 0 && !success) {
    return (
      <main className="checkoutPage">
        <h1>Order summary</h1>
        <Link to="/" className="backLink">
          ← Back to events
        </Link>
        <p>Your cart is empty.</p>
        <button className="primaryButton" onClick={() => navigate("/")}>
          Browse events
        </button>
      </main>
    );
  }

  async function handlePlaceOrder() {
    try {
      setIsSubmitting(true);
      setError("");
      setSuccess("");

      const response = await fetch(api("/orders"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: user.email,
          items: cartItems,
          total: cartTotal,
          createdAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Could not create order.");
      }

      setSuccess("Order created successfully. Redirecting to your orders...");

      setTimeout(() => {
        clearCart();
        navigate("/orders");
      }, 1200);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="checkoutPage">
      <Link to="/" className="backLink">
        ← Back to events
      </Link>
      <h1>Order summary</h1>

      {error && <p className="checkoutError">{error}</p>}
      {success && <p className="checkoutSuccess">{success}</p>}

         <section className="orderSummary">
        {cartItems.map((item) => (
          <article className="checkoutItem" key={item.id}>
            <h3>{item.title}</h3>
            <p>Quantity: {item.quantity}</p>
            <p>Price: {item.price === 0 ? "Free" : `${item.price} DKK`}</p>
            <p>
              Total:{" "}
              {item.price === 0 ? "Free" : `${item.price * item.quantity} DKK`}
            </p>
          </article>
        ))}
      </section>

      <h2>Total: {cartTotal} DKK</h2>

      <button
        className="primaryButton"
        onClick={handlePlaceOrder}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating order..." : "Place order"}
      </button>
    </main>
  );
}
