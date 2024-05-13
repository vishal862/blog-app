import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: null,
};

export const userSlice = createSlice({
  initialState,
  name: "user",
  reducers: {
    signinStart: (state) => {
      (state.loading = true), (state.error = null);
    },
    signinSuccess: (state, action) => {
      state.currentUser = action.payload;
      (state.loading = false), (state.error = null);
    },
    signinFailure: (state, action) => {
      (state.loading = false), (state.error = action.payload);
    },
    updateStart: (state) => {
      (state.loading = true), (state.error = null);
    },
    updateSuccess: (state, action) => {
      state.currentUser = action.payload;
      (state.loading = false), (state.error = null);
    },
    updateFailure: (state, action) => {
      (state.loading = false), (state.error = action.payload);
    },
    deleteStart: (state) => {
      (state.loading = true), (state.error = null);
    },
    deleteSuccess: (state, action) => {
      state.currentUser = null;
      (state.loading = false), (state.error = null);
    },
    deleteFailure: (state, action) => {
      (state.loading = false), (state.error = action.payload);
    },
    signOutSuccess: (state, action) => {
      state.currentUser = null;
      (state.loading = false), (state.error = null);
    },
  },
});

export const {
  signinStart,
  signinSuccess,
  signinFailure,
  updateStart,
  updateSuccess,
  updateFailure,
  deleteStart,
  deleteSuccess,
  deleteFailure,
  signOutSuccess
} = userSlice.actions;
export default userSlice.reducer;
