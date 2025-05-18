import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItemsCount, setCartItemsCount] = useState(0);

  const fetchCartCount = async () => {
    try {
      const res = await axiosInstance.get("/cart/view", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCartItemsCount(res.data.items.length);
    } catch (err) {
      console.error("Failed to fetch cart", err);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  return (
    <CartContext.Provider value={{ cartItemsCount, fetchCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
