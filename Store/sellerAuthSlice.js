import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const sellerAuthSlice = createSlice({
  name: "SAS",
  initialState: { sellerName: "", storeName : "" },
  reducers: {
    setAuth(state, action) {
      state.sellerName = action.payload.sellerName;
      state.storeName = action.payload.storeName
    },
  },
});

export function getCookiesSeller() {
  return async (dispatch) => {
    const sellerName = Cookies.get(`SName`);
    const sellerStoreName = Cookies.get(`STName`);
    if (sellerName && sellerStoreName ) {
      dispatch(sellerAuthActions.setAuth({sellerName , storeName : sellerStoreName}));
    } else {
      dispatch(sellerAuthActions.setAuth({sellerName : "" , storeName : ""}));
    }
  };
}

export const sellerAuthActions = sellerAuthSlice.actions;

export default sellerAuthSlice;
