import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: null,
  reducers: {
    setNotificationMessage(state, action) {
      return action.payload;
    },
    removeNotification() {
      return null;
    },
  },
});

export const { setNotificationMessage, removeNotification } =
  notificationSlice.actions;

export const setNotification = (message, length) => {
  return async (dispatch) => {
    dispatch(setNotificationMessage(message));

    setTimeout(() => {
      dispatch(removeNotification());
    }, length * 1000);
  };
};

export default notificationSlice.reducer;
