import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCart = localStorage.getItem("cartItems");
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Failed to parse cart items");
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  function addToCart(event, quantity) {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === event.id);
      if (existingItem) {
        return currentItems.map((item) =>
          item.id === event.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...currentItems, { ...event, quantity }];
    });
  }

  function removeFromCart(eventId) {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== eventId),
    );
  }

  function updateQuantity(eventId, quantity) {
    const safeQuantity = Math.max(1, quantity);
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === eventId ? { ...item, quantity: safeQuantity } : item,
      ),
    );
  }

  function increaseQuantity(eventId) {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === eventId ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  }

  function decreaseQuantity(eventId) {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === eventId ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function clearCart() {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  }

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.quantity * item.price,
    0,
  );
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
  decreaseQuantity,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
export function useCart() {
  return useContext(CartContext);
}
