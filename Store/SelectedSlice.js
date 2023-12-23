import { createSlice } from "@reduxjs/toolkit";

const selectedSlice = createSlice({
  name: "selected",
  initialState: { selectedProduct: false },
  reducers: {
    selectProduct(state) {
      state.selectedProduct = true ;   
    },
    openselected(state){
        state.selectedProduct = false ;
    },
  },
});


export const selectedActions = selectedSlice.actions ;

// export const noti = (state) => state.UI.notification ;

export default selectedSlice;
