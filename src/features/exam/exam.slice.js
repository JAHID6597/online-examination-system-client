import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import examService from "./exam.service";

const initialState = {
  exams: [],
  exam: null,
  isError: false,
  isSuccess: false,
  isActionSuccess: false,
  isLoading: false,
  message: "",
  resetData: false,
};

export const createExam = createAsyncThunk(
  "exam/create",
  async (formData, thunkAPI) => {
    try {
      return await examService.create(formData);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAllExam = createAsyncThunk(
  "exam/getAllExam",
  async (args, thunkAPI) => {
    try {
      return await examService.getAll();
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAllExamByCreator = createAsyncThunk(
  "exam/getAllExamByCreator",
  async (args, thunkAPI) => {
    try {
      return await examService.getAllByCreator();
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getExamDetails = createAsyncThunk(
  "exam/getDetails",
  async (id, thunkAPI) => {
    try {
      return await examService.getDetails(id);
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

const examSlice = createSlice({
  name: "exam",
  initialState,
  reducers: {
    resetExamCommonState: (state) => {
      resetState(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createExam.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createExam.fulfilled, (state, action) => {
        fulfilledState(state);
        state.exam = action.payload;
        state.isActionSuccess = true;
      })
      .addCase(createExam.rejected, (state, action) => {
        rejectedState(state, action.payload);
        state.exam = null;
      })
      .addCase(getAllExam.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllExam.fulfilled, (state, action) => {
        fulfilledState(state);
        state.exams = action.payload;
      })
      .addCase(getAllExam.rejected, (state, action) => {
        rejectedState(state, action.payload);
        state.exams = [];
      })
      .addCase(getAllExamByCreator.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllExamByCreator.fulfilled, (state, action) => {
        fulfilledState(state);
        state.exams = action.payload;
      })
      .addCase(getAllExamByCreator.rejected, (state, action) => {
        rejectedState(state, action.payload);
        state.exams = [];
      })
      .addCase(getExamDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getExamDetails.fulfilled, (state, action) => {
        fulfilledState(state);
        state.exam = action.payload;
      })
      .addCase(getExamDetails.rejected, (state, action) => {
        rejectedState(state, action.payload);
        state.exam = null;
      });
  },
});

export const { resetExamCommonState } = examSlice.actions;

export default examSlice.reducer;
