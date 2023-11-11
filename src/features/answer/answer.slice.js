import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import answerService from "./answer.service";

const initialState = {
  answers: [],
  answer: null,
  result: null,
  isError: false,
  isSuccess: false,
  isActionSuccess: false,
  isLoading: false,
  message: "",
  resetData: false,
};

export const createAnswer = createAsyncThunk(
  "answer/create",
  async (formData, thunkAPI) => {
    try {
      return await answerService.create(formData);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAllAnswerByParticipant = createAsyncThunk(
  "answer/getAllAnswerByParticipant",
  async (args, thunkAPI) => {
    try {
      return await answerService.getAllByParticipant();
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

const answerSlice = createSlice({
  name: "answer",
  initialState,
  reducers: {
    resetAnswerCommonState: (state) => {
      resetState(state);
    },
    resetAnswerResultState: (state) => {
      resetState(state);
      state.result = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAnswer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createAnswer.fulfilled, (state, action) => {
        fulfilledState(state);
        state.result = action.payload;
        state.isActionSuccess = true;
      })
      .addCase(createAnswer.rejected, (state, action) => {
        rejectedState(state, action.payload);
        state.result = null;
      })
      .addCase(getAllAnswerByParticipant.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllAnswerByParticipant.fulfilled, (state, action) => {
        fulfilledState(state);
        state.answers = action.payload;
      })
      .addCase(getAllAnswerByParticipant.rejected, (state, action) => {
        rejectedState(state, action.payload);
        state.answers = [];
      });
  },
});

export const { resetAnswerCommonState, resetAnswerResultState } = answerSlice.actions;

export default answerSlice.reducer;
