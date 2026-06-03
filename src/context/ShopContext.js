"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const ShopContext = createContext();

export function ShopProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [compareList, setCompareList] = useState([]);

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('wisetech_cart');
      const storedWishlist = localStorage.getItem('wisetech_wishlist');
      const storedCompare = localStorage.getItem('wisetech_compare');

      if (storedCart) setCart(JSON.parse(storedCart));
      if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
      if (storedCompare) setCompareList(JSON.parse(storedCompare));
    } catch (e) {
      console.error("Failed to load state", e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('wisetech_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('wisetech_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('wisetech_compare', JSON.stringify(compareList));
  }, [compareList]);

  const requireAuth = () => {
    const session = document.cookie.split('; ').find(row => row.startsWith('wisetech_session='));
    if (!session) {
      toast.error("Please sign in first");
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);
      return false;
    }
    return true;
  };

  const addToCart = (product) => {
    if (!requireAuth()) return;
    let message = "";
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        message = `Increased quantity for ${product.name}`;
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      message = `${product.name} added to cart!`;
      return [...prev, { ...product, quantity: 1 }];
    });
    // Use setTimeout to ensure toast fires outside the render cycle if needed, or just call it directly.
    // In React 18, calling it immediately after setCart is safe because it's outside the callback.
    toast.success(message);
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
    toast.success("Item removed from cart");
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return removeFromCart(id);
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const toggleWishlist = (product) => {
    if (!requireAuth()) return;
    let message = "";
    setWishlist(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        message = "Removed from wishlist";
        return prev.filter(item => item.id !== product.id);
      }
      message = "Added to wishlist!";
      return [...prev, product];
    });
    setTimeout(() => toast.success(message), 0);
  };

  const toggleCompare = (product) => {
    if (!requireAuth()) return;
    let message = "";
    let isError = false;
    setCompareList(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        message = "Removed from comparison";
        return prev.filter(item => item.id !== product.id);
      }
      if (prev.length >= 3) {
        message = "You can only compare up to 3 laptops.";
        isError = true;
        return prev;
      }
      message = "Added to comparison!";
      return [...prev, product];
    });
    setTimeout(() => {
      if (isError) toast.error(message);
      else toast.success(message);
    }, 0);
  };

  return (
    <ShopContext.Provider value={{
      cart, addToCart, removeFromCart, updateQuantity, cartTotal, cartCount,
      wishlist, toggleWishlist,
      compareList, toggleCompare
    }}>
      {children}
    </ShopContext.Provider>
  );
}

export const useShop = () => useContext(ShopContext);
