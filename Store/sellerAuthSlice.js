import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const sellerAuthSlice = createSlice({
  name: "SAS",
  initialState: { sellerName: "", storeName : ""  , role : "" , slug : ""},
  reducers: {
    setAuth(state, action) {
      state.sellerName = action.payload.sellerName;
      state.storeName = action.payload.storeName ; 
      state.role = action.payload.role ;
      state.slug = action.payload.slug ;
    },
  },
});

export function getCookiesSeller() {
  return async (dispatch) => {
    console.log(`in getting cookies`);
    const sellerName = Cookies.get(`SName`);
    const sellerStoreName = Cookies.get(`STName`);
    const sellerRole = Cookies.get("role");
    const storeSlug = Cookies.get("slug");
    if (sellerName && sellerStoreName && sellerRole && storeSlug ) {
      dispatch(sellerAuthActions.setAuth({sellerName , storeName : sellerStoreName , role : sellerRole , slug : storeSlug}));
    } else {
      dispatch(sellerAuthActions.setAuth({sellerName : "" , storeName : "" , role : "" , slug : ""}));
    }
  };
}

export const sellerAuthActions = sellerAuthSlice.actions;

export default sellerAuthSlice;
