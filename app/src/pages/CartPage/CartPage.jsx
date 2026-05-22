import { useCart } from "../../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  MapPin,
  Ticket,
  Trash2,
  ShoppingCart,
} from "lucide-react";
import "./CartPage.css";

function CartPage() {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    cartTotal,
  } = useCart();

  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <section className="cartPage">
        <Link to="/" className="backLink">
          ← Back to events
        </Link>

        <div className="cartEmpty">
          <h1>Your Cart</h1>
          <p>Your cart is empty.</p>
          <button className="primaryButton" onClick={() => navigate("/")}>
            Browse events
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="cartPage">
      <Link to="/" className="backLink">
        ← Back to events
      </Link>

      <h1>Your Cart</h1>

      <ul className="cartList">
        {cartItems.map((item) => (
          <li className="cartItem" key={item.id}>
            <h2>{item.title}</h2>

            <div className="cartInfo">
              <CalendarDays size={18} />
              <p>
                {item.date} at {item.time}
              </p>
            </div>

            <div className="cartInfo">
              <MapPin size={18} />
              <p>
                {item.venue}, {item.city}
              </p>
            </div>

            <div className="cartInfo">
              <Ticket size={18} />
              <p>{item.price === 0 ? "Free" : `${item.price} DKK`}</p>
            </div>

            <div className="cartQuantity">
              <p>Quantity:</p>

              <div className="quantityControls">
                <button
                  className="quantityButton"
                  onClick={() => decreaseQuantity(item.id)}
                >
                  −
                </button>

                <span className="quantityValue">{item.quantity}</span>

                <button
                  className="quantityButton"
                  onClick={() => increaseQuantity(item.id)}
                >
                  +
                </button>
              </div>
            </div>

            <p>
              Total:{" "}
              {item.price === 0 ? "Free" : `${item.price * item.quantity} DKK`}
            </p>

            <button
              className="secondaryButton"
              onClick={() => removeFromCart(item.id)}
            >
              <Trash2 size={18} />
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className="cartSummary">
        <h2>Total: {cartTotal === 0 ? "Free" : `${cartTotal} DKK`}</h2>

        <div className="cartSummaryActions">
          <button className="secondaryButton" onClick={clearCart}>
            Clear cart
          </button>

          <button
            className="primaryButton"
            onClick={() => navigate("/checkout")}
          >
            <ShoppingCart size={18} />
            Checkout
          </button>
        </div>
      </div>
    </section>
  );
}

export default CartPage;
