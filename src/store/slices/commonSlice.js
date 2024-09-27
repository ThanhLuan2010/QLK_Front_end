import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  isOpenModel: false,
  dataModel: undefined,
  isOpenPopover: false,
};

const commonSlice = createSlice({
  name: "brach",
  initialState,
  reducers: {
    doSetIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    doSetIsOpenModel: (state, action) => {
      state.isOpenModel = action.payload;
    },

    doSetDataModel: (state, action) => {
      state.dataModel = action.payload;
    },

    doSetIsOpenPopover: (state, action) => {
      state.isOpenPopover = action.payload;
    },
  },
});

export const {
  doSetIsLoading,
  doSetIsOpenModel,
  doSetDataModel,
  doSetIsOpenPopover,
} = commonSlice.actions;

export default commonSlice.reducer;
