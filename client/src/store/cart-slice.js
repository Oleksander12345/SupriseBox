import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        type: 'box' | 'subscription',
        items: [], // масив { item: {...}, quantity: n }
        quantity: 0,
        totalPrice: 0,
        totalQuantity: 0
    },
    reducers: {
        showCartItem(state, action) {
          const allItems = Array.isArray(action.payload) ? action.payload : [];
          state.boxItems = allItems.filter(i => i.item?.type === "box");
          state.subscriptionItems = allItems.filter(i => i.item?.type === "subscription");

          state.items = allItems;

          state.totalQuantity = allItems.reduce(
            (sum, i) => sum + (i.quantity || 1),
            0
          );
          state.totalPrice = allItems.reduce(
            (sum, i) => (i.item?.price || 0) * (i.quantity || 1) + sum,
            0
          );
          state.totalPrice = Number(state.totalPrice.toFixed(2));
        },
        countTotalPrice(state) {
            state.totalPrice = state.items.reduce(
                (sum, i) => sum + (i.item?.price || 0) * i.quantity,
                0
            );
        }
    }
})

export const cartActions = cartSlice.actions;
export default cartSlice;