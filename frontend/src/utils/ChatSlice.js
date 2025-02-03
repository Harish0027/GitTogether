import { createSlice } from "@reduxjs/toolkit";
const chatSlice = createSlice({
    name: "chat",
    initialState: {
      currentActiveChat: "",
      currentActiveChatName: "",
    },
    reducers: {
      updateCurrentActiveChat: (state, action) => {
        state.currentActiveChat = action.payload;
      },
      updateCurrentActiveChatName: (state, action) => { // Change this line
        state.currentActiveChatName = action.payload;
      },
    },
  });
  
  export default chatSlice.reducer;
  
  export const { updateCurrentActiveChat, updateCurrentActiveChatName } = chatSlice.actions; // Export with correct case
  