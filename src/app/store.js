import { configureStore } from "@reduxjs/toolkit";
import answerReducer from "../features/answer/answer.slice";
import examReducer from "../features/exam/exam.slice";
import questionReducer from "../features/question/question.slice";
import resultReducer from "../features/result/result.slice";
import userReducer from "../features/user/user.slice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    question: questionReducer,
    exam: examReducer,
    answer: answerReducer,
    result: resultReducer,
  },
});
