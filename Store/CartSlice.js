import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: { addedProduct: false },
  reducers: {
    addProduct(state) {
      state.addedProduct = true ;   
    },
    openCart(state){
        state.addedProduct = false ;
    },
  },
});


export const cartActions = cartSlice.actions;

// export const noti = (state) => state.UI.notification ;

export default cartSlice;
