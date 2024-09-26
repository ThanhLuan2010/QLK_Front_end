import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  branchs: [],
};

const branchSlice = createSlice({
  name: "brach",
  initialState,
  reducers: {
    doSetBranch: (state, action) => {
      state.branchs = action?.payload;
    },
  },
});

export const { doSetBranch } = branchSlice.actions;

export default branchSlice.reducer;
