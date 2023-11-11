import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userService from "./user.service";

const user = JSON.parse(localStorage.getItem("user")) || null;

const initialState = {
  user,
  isError: false,
  isSuccess: false,
  isActionSuccess: false,
  isLoading: false,
  message: "",
  resetData: false,
};

export const signUp = createAsyncThunk(
  "user/signup",
  async (formData, thunkAPI) => {
    try {
      return await userService.signUp(formData);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const signIn = createAsyncThunk(
  "user/signin",
  async (formData, thunkAPI) => {
    try {
      return await userService.signIn(formData);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk("user/logout", (args, thunkAPI) => {
  try {
    return userService.logout();
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || error.toString();

    return thunkAPI.rejectWithValue(message);
  }
});

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

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUserCommonState: (state) => {
      resetState(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signUp.fulfilled, (state) => {
        fulfilledState(state);
        state.isActionSuccess = true;
      })
      .addCase(signUp.rejected, (state, action) => {
        rejectedState(state, action.payload);
      })
      .addCase(signIn.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signIn.fulfilled, (state) => {
        fulfilledState(state);
        state.user = JSON.parse(localStorage.getItem("user"));
        state.isActionSuccess = true;
        state.privateProfile = JSON.parse(localStorage.getItem("user"));
      })
      .addCase(signIn.rejected, (state, action) => {
        rejectedState(state, action.payload);
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        fulfilledState(state);
        state.user = null;
        state.privateProfile = null;
        state.isActionSuccess = true;
      })
      .addCase(logout.rejected, (state, action) => {
        rejectedState(state, action.payload);
      });
  },
});

export const { resetUserCommonState } = userSlice.actions;

export default userSlice.reducer;
