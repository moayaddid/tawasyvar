import cartSlice from "./CartSlice";
import selectedSlice from "./SelectedSlice";
import vendorSlice from "./VendorSlice";

const { configureStore } = require("@reduxjs/toolkit");

const store = configureStore({
    reducer : {
        cart : cartSlice.reducer,
        selected : selectedSlice.reducer,
        vendor : vendorSlice.reducer,
    }
}) ; 

export {store} ;