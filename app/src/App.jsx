import { useState } from "react";
import Layout from "./components/Layout/Layout";
import EventSection from "./components/EventSection/EventSection";
import Login from "./pages/Login/Login";
import { Routes, Route, Navigate } from "react-router-dom";
import CartPage from "./pages/CartPage/CartPage";
import AccountPage from "./pages/AccountPage/AccountPage";
import OrdersPage from "./pages/OrdersPage/OrdersPage";
import EventDetail from "./pages/EventDetail/EventDetail";
import { useAuth } from "./context/AuthContext";
import CheckoutPage from "./pages/CheckoutPage/CheckoutPage";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const { user } = useAuth();

  return (
    <>
      <Layout onLoginClick={() => setShowLogin(true)}>
        <Routes>
          <Route path="/" element={<EventSection />} />
          <Route path="/events" element={<EventSection />} />
          <Route path="/cart" element={<CartPage />} />
          <Route
  path="/checkout"
  element={<CheckoutPage onLoginClick={() => setShowLogin(true)} />}
/>
          <Route
            path="/account"
            element={user ? <AccountPage /> : <Navigate to="/" />}
          />

          <Route
            path="/orders"
            element={user ? <OrdersPage /> : <Navigate to="/" />}
          />
          <Route path="/events/:id" element={<EventDetail />} />
        </Routes>
      </Layout>
      {showLogin && <Login onClose={() => setShowLogin(false)} />}
    </>
  );
}

export default App;
