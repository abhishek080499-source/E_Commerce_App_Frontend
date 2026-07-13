// src/redux/wishlistSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlist: (state, action) => {
      state.items = action.payload || [];
    },
    removeWishlist: (state, action) => {
      // action.payload = productId
      state.items = state.items.filter(
        (item) => (item.productId?._id || item._id) !== action.payload
      );
    },
    clearWishlist: (state) => {
      state.items = [];
    },
  },
});

export const { setWishlist, removeWishlist, clearWishlist } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;
