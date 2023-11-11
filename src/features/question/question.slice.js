import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import questionService from "./question.service";

const initialState = {
  questions: [],
  question: null,
  isError: false,
  isSuccess: false,
  isActionSuccess: false,
  isLoading: false,
  message: "",
  resetData: false,
};

export const createQuestion = createAsyncThunk(
  "question/create",
  async (formData, thunkAPI) => {
    try {
      return await questionService.create(formData);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAllQuestion = createAsyncThunk(
  "question/getAll",
  async (args, thunkAPI) => {
    try {
      return await questionService.getAll();
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

const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {
    resetQuestionCommonState: (state) => {
      resetState(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createQuestion.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createQuestion.fulfilled, (state, action) => {
        fulfilledState(state);
        state.question = action.payload;
        state.isActionSuccess = true;
      })
      .addCase(createQuestion.rejected, (state, action) => {
        rejectedState(state, action.payload);
        state.question = null;
      })
      .addCase(getAllQuestion.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllQuestion.fulfilled, (state, action) => {
        fulfilledState(state);
        state.questions = action.payload;
      })
      .addCase(getAllQuestion.rejected, (state, action) => {
        rejectedState(state, action.payload);
        state.questions = [];
      });
  },
});

export const { resetQuestionCommonState } = questionSlice.actions;

export default questionSlice.reducer;
