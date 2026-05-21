import "./Layout.css";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { ShoppingCart, User } from "lucide-react";

export default function Layout({ children, onLoginClick }) {
  const { user, logout } = useAuth();
  const { cartCount, clearCart } = useCart();

  function handleLogout() {
    logout();
    clearCart();
  }

  return (
    <div className="appShell">
      <header className="header">
       

        <Link to="/" className="logoText">
          EVENT STARTUP
        </Link>

        <nav className="navbar">
          <Link to="/cart" className="navButton">
            <ShoppingCart size={22} />
            <span>Cart</span>
            {cartCount > 0 && <span className="cartCount">{cartCount}</span>}
          </Link>

          {user && (
            <>
              <Link to="/account" className="navButton">
                Account
              </Link>

              <Link to="/orders" className="navButton">
                Orders
              </Link>
            </>
          )}

          {user ? (
            <button className="navButton" onClick={handleLogout}>
              <User size={22} />
              <span>Sign out</span>
            </button>
          ) : (
            <button className="navButton" onClick={onLoginClick}>
              <User size={22} />
              <span>Login</span>
            </button>
          )}
        </nav>
      </header>

      <main className="mainContent">{children}</main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Event Startup</p>
      </footer>
    </div>
  );
}