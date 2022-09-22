import { createSlice } from "@reduxjs/toolkit";

export interface NotificationState {
  count: number;
}

const initialState: NotificationState = {
  count: 0,
};

export const notificationSlice = createSlice({
  name: "notificationState",
  initialState,
  reducers: {
    countUp: (state) => {
      state.count = state.count + 1;
    },
    clear: (state) => {
      state.count = 0;
    },
  },
});

// Action creators are generated for each case reducer function
export const { countUp, clear } = notificationSlice.actions;

export default notificationSlice.reducer;
