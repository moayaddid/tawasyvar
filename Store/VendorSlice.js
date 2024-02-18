import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
// import { toast } from "react-toastify";

const vendorSlice = createSlice({
  name: "vendor",
  initialState: { selectedProduct: false, products: [] },
  reducers: {
    selectProduct(state, action) {
      const old = state.products.find((product) => {
        if (product.line_id && action.payload.line_id) {
          product.line_id === action.payload.line_id
        } else {
          product.id == action.payload.id
        }
      });
      if (old || old != undefined) {
      } else {
        state.products.push(action.payload);
        Cookies.set(`vendorSelectedProducts`, JSON.stringify(state.products), {
          expires: 365 * 10,
        });
        state.selectedProduct = true ;
      }
    },
    unSelectProduct(state, action) { 
      // console.log(action.payload);
      state.products = state.products.filter(
        (product) => {
          if (product.line_id && action.payload.line_id) {
           return  product.line_id != action.payload.line_id
          } else {
           return  product.id != action.payload.id
          }
        }
      );
      Cookies.set(`vendorSelectedProducts`, JSON.stringify(state.products), {
        expires: 365 * 10,
      });
    },
    openselected(state) {
      state.selectedProduct = false;
    },
    setProducts(state, action) {
      state.products = action.payload;
    },
  },
});

export function getCookiesProducts() {
  return async (dispatch) => {
    const products = Cookies.get(`vendorSelectedProducts`);
    if (products) {
      dispatch(vendorActions.setProducts(JSON.parse(products)));
    } else {
      dispatch(vendorActions.setProducts([]));
    }
  };
}

export const vendorActions = vendorSlice.actions;

export default vendorSlice;