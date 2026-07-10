// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";

// ✅ Load cart state from localStorage (optional persistence)
const loadState = () => {
  try {
    const serializedState = localStorage.getItem("cartState");
    return serializedState ? JSON.parse(serializedState) : undefined;
  } catch {
    return undefined;
  }
};

// ✅ Save cart state to localStorage
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state.cart);
    localStorage.setItem("cartState", serializedState);
  } catch {
    // ignore write errors
  }
};

const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  preloadedState: { cart: loadState() }, // ✅ preload from localStorage
});

// ✅ Subscribe to store changes and persist
store.subscribe(() => {
  saveState(store.getState());
});

export default store;
