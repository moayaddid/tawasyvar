import { createSlice } from "@reduxjs/toolkit";
// import { toast } from "react-toastify";

const vendorSlice = createSlice({
  name: "vendor",
  initialState: { selectedProduct: false, products: [] },
  reducers: {
    selectProduct(state, action) {
      // console.log(action.payload);
        // state.selectedProduct = true ;
      const old = state.products.find(
        (product) => product.id == action.payload.id
      );
      if (old || old != undefined) {
        toast.error(`This product is already selected `, {
          theme: "colored",
          autoClose: "1000",
        });
      } else {
        state.products.push(action.payload);
        toast.success("the product was selected successfuly", {
          theme: "colored",
          autoClose: "1000",
        });
      }
    },
    openselected(state) {
      state.selectedProduct = false;
    },
  },
});

export const vendorActions = vendorSlice.actions;

export default vendorSlice;
