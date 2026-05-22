import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./EventDetail.css";
import api from "../../services/api";
import { useCart } from "../../context/CartContext";
import { CalendarDays, Clock3, MapPin, FileText, Ticket } from "lucide-react";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showCartMessage, setShowCartMessage] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchEventDetail() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(api(`/events/${id}`));

        if (!response.ok) {
          throw new Error("Failed to load event detail");
        }

        const data = await response.json();
        setEvent(data);
        setQuantity(1);
      } catch (err) {
        setError("Could not load event details.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchEventDetail();
    }
  }, [id]);

  function getPriceMessage() {
    return event.price === 0 ? "Free" : `${event.price} DKK`;
  }

  function getAvailabilityMessage() {
    return event.ticketsAvailable === 0
      ? "Sold out"
      : `${event.ticketsAvailable} ticket${event.ticketsAvailable > 1 ? "s" : ""} available`;
  }

  function getTotalPriceMessage() {
    return event.price === 0 ? "Free" : `${event.price * quantity} DKK`;
  }
  function decreaseTicketQuantity() {
    setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1));
  }

  function increaseTicketQuantity() {
    setQuantity((currentQuantity) =>
      Math.min(event.ticketsAvailable, currentQuantity + 1),
    );
  }
  function handleAddToCart() {
    addToCart(event, quantity);
    setShowCartMessage(true);
  }

  if (loading) return <p>Loading event details...</p>;
  if (error) return <p>{error}</p>;
  if (!event) return null;

  return (
    <div className="event-detail-overlay">
      <section className="event-detail">
        <button className="closeButton" onClick={() => navigate(-1)}>
          ✕
        </button>

        <h2>{event.title}</h2>

        <div className="eventInfo">
          <CalendarDays size={18} />
          <p>{event.date}</p>
        </div>
        <div className="eventInfo">
          <Clock3 size={18} />
          <p>{event.time}</p>
        </div>
        <div className="eventInfo">
          <MapPin size={18} />
          <p>
            {event.venue}, {event.city}
          </p>
        </div>
        <div className="eventInfo">
          <FileText size={18} />
          <p>{event.description}</p>
        </div>
        <div className="eventInfo">
          <Ticket size={18} />
          <p>{getPriceMessage()}</p>
        </div>
        <div className="eventInfo">
          <Ticket size={18} />
          <p>{getAvailabilityMessage()}</p>
        </div>

        {event.ticketsAvailable === 0 ? (
          <p>This event is sold out</p>
        ) : (
          <>
            {!showCartMessage && (
              <>
                <div className="ticketQuantity">
                  <p>Ticket Quantity:</p>

                  <div className="quantityControls">
                    <button
                      type="button"
                      className="quantityButton"
                      onClick={decreaseTicketQuantity}
                    >
                      −
                    </button>

                    <span className="quantityValue">{quantity}</span>

                    <button
                      type="button"
                      className="quantityButton"
                      onClick={increaseTicketQuantity}
                    >
                      +
                    </button>
                  </div>
                </div>

                <p>Total price: {getTotalPriceMessage()}</p>

                <button onClick={handleAddToCart}>Add to cart</button>
              </>
            )}

            {showCartMessage && (
              <div className="cartMessage">
                <p>
                  {quantity} ticket{quantity > 1 ? "s" : ""} added to cart.
                </p>

                <div className="cartMessageActions">
                  <Link to="/events" className="secondaryButton">
                    Continue browsing
                  </Link>

                  <Link to="/cart" className="primaryButton">
                    Go to cart
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
