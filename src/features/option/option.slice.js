import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import optionService from "./option.service";

const initialState = {
  options: [],
  isError: false,
  isSuccess: false,
  isActionSuccess: false,
  isLoading: false,
  message: "",
  resetData: false,
};

export const create = createAsyncThunk(
  "option/create",
  async (formData, thunkAPI) => {
    try {
      return await optionService.create(formData);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

const fulfilledState = (state) => {
  state.isError = false;
  state.isSuccess = true;
  state.isLoading = false;
  state.message = "";
};

const rejectedState = (state, message) => {
  state.isError = true;
  state.isSuccess = false;
  state.isActionSuccess = false;
  state.isLoading = false;
  state.message = message;
};

const resetState = (state) => {
  state.isError = false;
  state.isSuccess = false;
  state.isLoading = false;
  state.message = "";
  state.resetData = false;
  state.isActionSuccess = false;
};

const optionSlice = createSlice({
  name: "option",
  initialState,
  reducers: {
    resetOptionCommonState: (state) => {
      resetState(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(create.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(create.fulfilled, (state) => {
        fulfilledState(state);
        state.isActionSuccess = true;
      })
      .addCase(create.rejected, (state, action) => {
        rejectedState(state, action.payload);
      });
  },
});

export const { resetUserCommonState } = optionSlice.actions;

export default optionSlice.reducer;
