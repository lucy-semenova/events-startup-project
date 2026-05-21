import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { Ticket } from "lucide-react";
import "./OrdersPage.css";
import { Link } from "react-router-dom";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { user, token } = useAuth();

  useEffect(() => {
    async function fetchOrders() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          api(`/orders?email=${encodeURIComponent(user.email)}`),
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to load orders");
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError("Could not load your orders.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [user, token]);

  if (loading) {
    return <p>Loading your orders...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (orders.length === 0) {
    return (
      <section className="ordersPage">
        <Link to="/" className="backLink">
          ← Back to events
        </Link>
        <h1>My Orders</h1>

        <p>You do not have any orders yet.</p>
      </section>
    );
  }

  return (
    <section className="ordersPage">
      <Link to="/" className="backLink">
        ← Back to events
      </Link>
      <h1>My Orders</h1>

      <div className="ordersList">
        {orders.map((order) => (
          <article className="orderCard" key={order.id}>
            <div className="orderCardHeader">
              <div>
                <h2>Order Summary</h2>
              </div>

              <span className="orderStatus">Confirmed</span>
            </div>

            <p>
              Date:{" "}
              {order.createdAt
                ? new Date(order.createdAt).toLocaleDateString()
                : "Unknown date"}
            </p>

            <p>Total: {order.total === 0 ? "Free" : `${order.total} DKK`}</p>

            <div className="ticketsBox">
              <h3>Tickets</h3>

              <ul className="ticketsList">
                {order.items.map((item) => (
                  <li className="ticketItem" key={item.id}>
                    <Ticket size={18} />

                    <div>
                      <strong>{item.title}</strong>

                      <p>
                        {item.quantity} ticket
                        {item.quantity > 1 ? "s" : ""}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default OrdersPage;
