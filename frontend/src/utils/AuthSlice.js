import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("token") || "",
  user: {},
};

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    addToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
    addUser: (state, action) => {
      state.user = action.payload;
    },
    removeToken: (state) => {
      state.token = "";
      state.user = {};
      localStorage.removeItem("token");
    },
  },
});

export default AuthSlice.reducer;
export const { addToken, addUser, removeToken } = AuthSlice.actions;
