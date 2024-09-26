import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
};

const commonSlice = createSlice({
  name: "brach",
  initialState,
  reducers: {
    doSetIsLoading: (state, action) => {
      console.log("🚀 ~ action:", action);
      state.isLoading = action.payload;
    },
  },
});

export const { doSetIsLoading } = commonSlice.actions;

export default commonSlice.reducer;
