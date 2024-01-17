import { createSlice } from "@reduxjs/toolkit";

const vendorSlice = createSlice({
  name: "vendor",
  initialState: { selectedProduct: false, products: [] },
  reducers: {
    selectProduct(state, action) {
      console.log(action.payload);
      //   state.selectedProduct = true ;
    },
    openselected(state) {
      state.selectedProduct = false;
    },
  },
});

export const vendorActions = vendorSlice.actions;

// export const noti = (state) => state.UI.notification ;

export default vendorSlice;
