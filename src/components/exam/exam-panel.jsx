import { Box, Button, Container, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { Fragment, useEffect, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
    createAnswer,
    resetAnswerResultState,
} from "../../features/answer/answer.slice";
import {
    getExamDetails,
    resetExamCommonState,
} from "../../features/exam/exam.slice";
import { resetResultCommonState } from "../../features/result/result.slice";
import CenterScreenLayout from "../../layout/center-screen-layout";
import FullBackdrop from "../common/full-backdrop";
import ExamQuestionCard from "./exam-question-card";

const ExamPanel = () => {
  const { id } = useParams();
  const {
    exam,
    isError: isExamError,
    message: examMessage,
    isLoading: isExamLoading,
  } = useSelector((state) => state.exam);
  const {
    result,
    isError: isAnswerResultError,
    message: resultMessage,
    isActionSuccess: isAnswerActionSuccess,
    isLoading: isResultLoading,
  } = useSelector((state) => state.answer);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selected, setSelected] = useState({});
  const [submitPrevent, setSubmitPrevent] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isQuestionWise, setIsQuestionWise] = useState(false);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (isExamError) toast.error(examMessage);

    return () => dispatch(resetExamCommonState());
  }, [dispatch, isExamError, examMessage]);

  useEffect(() => {
    if (exam?.exam_duration_type) {
      const isQuestionWiseExam = exam?.exam_duration_type === "QUESTION_WISE";
      setIsQuestionWise(isQuestionWiseExam);
    }
  }, [exam]);

  useEffect(() => {
    dispatch(getExamDetails(id));

    return () => dispatch(resetExamCommonState());
  }, [dispatch, id]);

  useEffect(() => {
    if (isAnswerResultError) toast.error(resultMessage);

    return () => dispatch(resetResultCommonState());
  }, [dispatch, isAnswerResultError, resultMessage]);

  useEffect(() => {
    if (isAnswerActionSuccess && result) {
      navigate(`/result/${result.attempt_id}`, { replace: true });
    }

    return () => dispatch(resetAnswerResultState());
  }, [dispatch, isAnswerActionSuccess, navigate, result]);

  useEffect(() => {
    if (submitPrevent) {
      confirmAlert({
        title: "Submit Failed.",
        message:
          "Please answer at least 1 question to complete this exam. Do you want to continue again from the very beginning?",
        closeOnEscape: false,
        closeOnClickOutside: false,
        buttons: [
          {
            label: "Yes",
            onClick: () => window.location.reload(),
          },
          {
            label: "No",
            onClick: () => navigate("/", { replace: true }),
          },
        ],
      });
      setSubmitPrevent(false);
    }
  }, [navigate, submitPrevent]);

  useEffect(() => {
    if (exam?.exam_duration_type) {
      setDuration(
        isQuestionWise
          ? +exam?.exams_details[currentIdx]?.duration
          : +exam?.duration
      );
    }
  }, [isQuestionWise, exam, currentIdx]);

  const handleSelectAnswer = (details, selectedOptionId) => {
    const prevSelected = { ...selected };
    const question = details?.question;
    const item = prevSelected?.[question.id];
    const body = {
      exam_id: id,
      question_id: question.id,
      selected_option_id: selectedOptionId,
      positive_marks: details?.positive_marks,
      negative_marks: details?.negative_marks,
      candidate_id: user.id,
    };
    if (item) {
      if (item?.[selectedOptionId]) delete item[selectedOptionId];
      else if (question.type === "SINGLE_CHOICE" && Object.keys(item)?.length) {
        prevSelected[question.id] = {
          [selectedOptionId]: body,
        };
      } else item[selectedOptionId] = body;
    } else {
      prevSelected[question.id] = {
        [selectedOptionId]: body,
      };
    }

    setSelected(prevSelected);
  };

  const handleSubmitQuiz = () => {
    const body = {
      answer_list: [],
    };

    Object.keys(selected).forEach((questionId) => {
      Object.keys(selected[questionId]).forEach((optionId) => {
        body.answer_list.push(selected[questionId][optionId]);
      });
    });

    if (!body.answer_list.length) {
      setSubmitPrevent(true);
      return;
    }

    dispatch(createAnswer(body));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    handleSubmitQuiz();
  };

  const handleNextIdx = () => {
    setCurrentIdx((prev) => prev + 1);
  };

  return (
    <>
      {(isExamLoading || isResultLoading) && (
        <FullBackdrop isOpenBackDrop={isExamLoading || isResultLoading} />
      )}

      {exam && (
        <Box
          sx={{
            background:
              "linear-gradient(179.4deg, rgb(12, 20, 69) -16.9%, rgb(71, 30, 84) 119.9%)",
            minHeight: "100vh",
            p: 2,
          }}
        >
          <CenterScreenLayout>
            <Box
              sx={{
                boxShadow:
                  "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset",
                background: "#EAEDED",
              }}
            >
              <Container component="main" maxWidth="sm">
                <Typography
                  variant="h3"
                  sx={{ my: 3, fontWeight: "bold", textAlign: "center" }}
                >
                  {exam?.exam_name}
                </Typography>

                <Box sx={{ textAlign: "end", mb: 3 }}>
                  <CountdownTimer
                    duration={duration}
                    setDuration={setDuration}
                    handleSubmitQuiz={handleSubmitQuiz}
                    currentIdx={currentIdx}
                    handleNextIdx={handleNextIdx}
                    isQuestionWise={isQuestionWise}
                    totalQuestions={exam?.exams_details?.length}
                  />
                </Box>

                <Box
                  component="form"
                  autoComplete="off"
                  onSubmit={handleSubmit}
                >
                  <Box
                    sx={{
                      pb: { md: 5, xs: 3 },
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    {exam?.exams_details?.map((details, index) => (
                      <Fragment key={details?.id}>
                        {isQuestionWise && index === currentIdx ? (
                          <ExamQuestionCard
                            key={details?.id}
                            exam_details={details}
                            question={details?.question}
                            selected={selected}
                            handleSelectAnswer={handleSelectAnswer}
                          />
                        ) : (
                          ""
                        )}

                        {!isQuestionWise ? (
                          <ExamQuestionCard
                            exam_details={details}
                            question={details?.question}
                            selected={selected}
                            handleSelectAnswer={handleSelectAnswer}
                          />
                        ) : (
                          ""
                        )}
                      </Fragment>
                    ))}

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 5,
                        my: 0.5,
                        width: "100%",
                      }}
                    >
                      {exam?.exam_duration_type === "QUESTION_WISE" &&
                      currentIdx + 1 < exam?.exams_details?.length ? (
                        <Button
                          sx={{
                            background: "#000",
                            color: "#fff",
                            px: 3,
                            fontWeight: "bold",
                            "&:hover": {
                              background: "#000",
                              color: "#fff",
                            },
                          }}
                          size="medium"
                          onClick={handleNextIdx}
                        >
                          Next
                        </Button>
                      ) : (
                        ""
                      )}

                      {exam?.exam_duration_type === "FULL_EXAM" ||
                      (exam?.exam_duration_type === "QUESTION_WISE" &&
                        currentIdx + 1 === exam?.exams_details?.length) ? (
                        <Button
                          sx={{
                            background: "#000",
                            color: "#fff",
                            px: 3,
                            fontWeight: "bold",
                            "&:hover": {
                              background: "#000",
                              color: "#fff",
                            },
                          }}
                          size="medium"
                          type="submit"
                        >
                          Submit
                        </Button>
                      ) : (
                        ""
                      )}
                    </Box>
                  </Box>
                </Box>
              </Container>
            </Box>
          </CenterScreenLayout>
        </Box>
      )}
    </>
  );
};

export default ExamPanel;

export const CountdownTimer = ({
  duration,
  setDuration,
  handleSubmitQuiz,
  currentIdx,
  handleNextIdx,
  isQuestionWise,
  totalQuestions,
}) => {
  console.log(duration);
  //   const [time, setTime] = useState(duration);
  const navigate = useNavigate();

  useEffect(() => {
    console.log({ isQuestionWise, currentIdx, totalQuestions });
    const timer = setInterval(() => {
      if (duration < 1) return;
      if (duration === 1) {
        clearInterval(timer);
        setDuration((prevTime) => prevTime - 1);
        if (isQuestionWise && currentIdx + 1 !== totalQuestions) {
          console.log("object");
          handleNextIdx();
          return;
        }
        confirmAlert({
          title: "Your time is over.",
          message: "Do you want to continue again from the very beginning?",
          closeOnEscape: false,
          closeOnClickOutside: false,
          buttons: [
            {
              label: "Yes",
              onClick: () => window.location.reload(),
            },
            {
              label: "No",
              onClick: () => navigate("/", { replace: true }),
            },
            {
              label: "Finish Exam",
              onClick: () => handleSubmitQuiz(),
            },
          ],
        });

        return;
      }
      setDuration((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIdx, duration, handleNextIdx, handleSubmitQuiz, isQuestionWise, navigate, setDuration, totalQuestions]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const getTimePad = (format) => format.toString().padStart(2, "0");

    return `${getTimePad(hours)}:${getTimePad(minutes)}:${getTimePad(seconds)}`;
  };

  return <h2>{formatTime(duration)}</h2>;
};

CountdownTimer.propTypes = {
  duration: PropTypes.number,
  setDuration: PropTypes.func,
  handleSubmitQuiz: PropTypes.func,
  currentIdx: PropTypes.number,
  handleNextIdx: PropTypes.func,
  isQuestionWise: PropTypes.bool,
  totalQuestions: PropTypes.number,
};
