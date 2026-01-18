import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import api from "../api";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });

  const fetchCart = async () => {
    if (!user?.token) {
      setCartItems([]);
      localStorage.removeItem("cart");
      return;
    }

    try {
      const res = await api.get("/cart/view");
      const items = res.data?.data?.items || [];
      setCartItems(items);
      localStorage.setItem("cart", JSON.stringify(items));
    } catch (err) {
      console.error("Cart fetch failed", err);
      setCartItems([]);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
