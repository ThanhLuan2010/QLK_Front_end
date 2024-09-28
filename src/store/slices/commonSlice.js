import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  isOpenModel: false,
  dataModel: undefined,
  isOpenPopover: false,
  dataInPopover: undefined,
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

    doSetDataInPopover: (state, action) => {
      state.dataInPopover = action.payload;
    },
  },
});

export const {
  doSetIsLoading,
  doSetIsOpenModel,
  doSetDataModel,
  doSetIsOpenPopover,
  doSetDataInPopover,
} = commonSlice.actions;

export default commonSlice.reducer;
