// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";


const loadState = () => {
  try {
    const serializedState = localStorage.getItem("cartState");
    return serializedState ? JSON.parse(serializedState) : undefined;
  } catch {
    return undefined;
  }
};


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
  preloadedState: { cart: loadState() },
});

store.subscribe(() => {
  saveState(store.getState());
});

export default store;
