import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: "Test notification",
  reducers: {
    setNotification(state, action) {
      return action.payload;
    },
    removeNotification() {
      return null;
    },
  },
});

export const { setNotification, removeNotification } =
  notificationSlice.actions;

export const showNotification = (notif) => {
  return (dispatch) => {
    dispatch(setNotification(notif));

    setTimeout(() => {
      dispatch(removeNotification());
    }, 5000);
  };
};

export default notificationSlice.reducer;
