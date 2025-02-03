import {configureStore} from "@reduxjs/toolkit"
import AuthReducer from "./AuthSlice"
 import ChatReducer from "./ChatSlice"

const Store=configureStore({
      reducer:{
        auth:AuthReducer,
        chat:ChatReducer
      }
});

export default Store;

