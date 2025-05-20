import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth-slice";
import cartModalSlice from "./cartModal-slice";
import cartSlice from "./cart-slice";
import adminSlice from "./admine-slice";


const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    cartModal: cartModalSlice.reducer,
    cart: cartSlice.reducer,
    admin: adminSlice.reducer,
  },
});
export default store;