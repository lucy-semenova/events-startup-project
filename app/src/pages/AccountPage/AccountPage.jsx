import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { User, Mail, ReceiptText, ArrowLeft } from "lucide-react";
import "./AccountPage.css";

function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    const confirmed = window.confirm("Are you sure you want to sign out?");

    if (!confirmed) {
      return;
    }

    logout();
    navigate("/");
  }

  return (
    <section className="accountPage">
      <Link to="/" className="backLink">
        <ArrowLeft size={18} />
        Back to events
      </Link>

      <div className="accountCard">
        <div className="accountHeader">
          <div className="accountIcon">
            <User size={36} />
          </div>

          <div>
            <h1>My Account</h1>
          </div>
        </div>

        <div className="accountInfo">
          <div className="accountInfoItem">
            <Mail size={18} />
            <div>
              <strong>{user?.email}</strong>
            </div>
          </div>
        </div>

        <div className="accountActions">
          <Link to="/orders" className="primaryAccountButton">
            <ReceiptText size={18} />
            View orders
          </Link>

          <button className="secondaryAccountButton" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </div>
    </section>
  );
}

export default AccountPage;
