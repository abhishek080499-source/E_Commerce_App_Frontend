
// src/redux/cartPersistence.js

import {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} from "./cartSlice";

/**
 * Get the currently logged-in user's ID.
 */
const getCurrentUserId = () => {
  try {
    const user = JSON.parse(
      localStorage.getItem("user")
    );

    return user?._id || null;
  } catch (error) {
    console.error(
      "Unable to read current user:",
      error
    );

    return null;
  }
};

/**
 * Save the current user's cart.
 */
const saveUserCart = (cart) => {
  try {
    const userId = getCurrentUserId();

    // Don't save anything if there is no logged-in user.
    if (!userId) {
      return;
    }

    localStorage.setItem(
      `cart_${userId}`,
      JSON.stringify(cart)
    );
  } catch (error) {
    console.error(
      "Unable to save cart:",
      error
    );
  }
};

/**
 * Redux middleware for cart persistence.
 *
 * It saves the updated Redux cart to localStorage
 * whenever a cart-changing action is dispatched.
 */
export const cartPersistenceMiddleware =
  (store) => (next) => (action) => {
    const result = next(action);

    const cartActions = [
      addToCart.type,
      removeFromCart.type,
      increaseQuantity.type,
      decreaseQuantity.type,
      clearCart.type,
    ];

    if (cartActions.includes(action.type)) {
      const cart = store.getState().cart.items;

      saveUserCart(cart);
    }

    return result;
  };
