import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import resultService from "./result.service";

const initialState = {
  results: [],
  result: null,
  isError: false,
  isSuccess: false,
  isActionSuccess: false,
  isLoading: false,
  message: "",
  resetData: false,
};

export const getAttemptResult = createAsyncThunk(
  "answer/getAttemptResult",
  async (attemptId, thunkAPI) => {
    try {
      return await resultService.getAttemptResult(attemptId);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAllResult = createAsyncThunk(
  "answer/getAllResult",
  async (args, thunkAPI) => {
    try {
      return await resultService.getAllResult();
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

const resultSlice = createSlice({
  name: "result",
  initialState,
  reducers: {
    resetResultCommonState: (state) => {
      resetState(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAttemptResult.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAttemptResult.fulfilled, (state, action) => {
        fulfilledState(state);
        state.result = action.payload;
      })
      .addCase(getAttemptResult.rejected, (state, action) => {
        rejectedState(state, action.payload);
        state.result = null;
      })
      .addCase(getAllResult.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllResult.fulfilled, (state, action) => {
        fulfilledState(state);
        state.results = action.payload;
      })
      .addCase(getAllResult.rejected, (state, action) => {
        rejectedState(state, action.payload);
        state.results = [];
      });
  },
});

export const { resetResultCommonState } = resultSlice.actions;

export default resultSlice.reducer;
