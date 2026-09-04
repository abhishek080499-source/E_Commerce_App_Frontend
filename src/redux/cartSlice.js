
// src/redux/cartSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {
    // Used when a user logs in
    // to load that user's saved cart into Redux.
    setCart: (state, action) => {
      state.items = Array.isArray(action.payload)
        ? action.payload
        : [];
    },

    addToCart: (state, action) => {
      const item = action.payload;

      const existing = state.items.find(
        (i) => i._id === item._id
      );

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({
          ...item,
          quantity: 1,
        });
      }
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (i) => i._id !== action.payload
      );
    },

    increaseQuantity: (state, action) => {
      const item = state.items.find(
        (i) => i._id === action.payload
      );

      if (item) {
        item.quantity += 1;
      }
    },

    decreaseQuantity: (state, action) => {
      const item = state.items.find(
        (i) => i._id === action.payload
      );

      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  setCart,
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;