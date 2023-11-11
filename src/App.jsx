import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ExamForm from "./components/exam/exam-form";
import ExamList from "./components/exam/exam-list";
import ExamPanel from "./components/exam/exam-panel";
import Header from "./components/header";
import Main from "./components/main/main";
import QuestionForm from "./components/question/question-form";
import QuestionList from "./components/question/question-list";
import Result from "./components/result/result";
import UserAuthForm from "./components/user/user-auth-form";
import CandidateRoute from "./route/candidate.route";
import ExaminerRoute from "./route/examiner.route";
import UnAuthorizedRoute from "./route/un-authorized.route";

const App = () => {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Main />} />

        <Route
          path="signin"
          element={
            <UnAuthorizedRoute>
              <UserAuthForm isSignUp={false} />
            </UnAuthorizedRoute>
          }
        />

        <Route
          path="signup"
          element={
            <UnAuthorizedRoute>
              <UserAuthForm isSignUp />
            </UnAuthorizedRoute>
          }
        />

        <Route path="question" element={<Outlet />}>
          <Route
            path="add-new"
            element={
              <ExaminerRoute>
                <QuestionForm />
              </ExaminerRoute>
            }
          />
          <Route
            path="all"
            element={
              <ExaminerRoute>
                <QuestionList />
              </ExaminerRoute>
            }
          />
        </Route>

        <Route path="exam" element={<Outlet />}>
          <Route
            path="add-new"
            element={
              <ExaminerRoute>
                <ExamForm />
              </ExaminerRoute>
            }
          />

          <Route
            path="all"
            element={
              <ExaminerRoute>
                <ExamList />
              </ExaminerRoute>
            }
          />

          <Route
            path="panel/:id"
            element={
              <CandidateRoute>
                <ExamPanel />
              </CandidateRoute>
            }
          />
        </Route>

        <Route path="result" element={<Outlet />}>
          <Route
            path=":attemptId"
            element={
              <CandidateRoute>
                <Result />
              </CandidateRoute>
            }
          />
        </Route>
      </Routes>

      <ToastContainer />
    </BrowserRouter>
  );
};

export default App;
