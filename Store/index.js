import cartSlice from "./CartSlice";
import selectedSlice from "./SelectedSlice";

const { configureStore } = require("@reduxjs/toolkit");

const store = configureStore({
    reducer : {
        cart : cartSlice.reducer,
        selected : selectedSlice.reducer,
    }
}) ; 

export {store} ;