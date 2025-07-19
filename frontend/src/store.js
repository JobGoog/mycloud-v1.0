import { configureStore, createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    setUser(_, action) {
      return action.payload;
    },
    logout() {
      return null;
    },
  },
});

export const { setUser, logout } = userSlice.actions;

export default configureStore({
  reducer: { user: userSlice.reducer },
  devTools: import.meta.env.DEV,
});
