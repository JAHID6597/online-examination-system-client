import { Box, Chip, Container, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getAttemptResult,
  resetResultCommonState,
} from "../../features/result/result.slice";
import CenterScreenLayout from "../../layout/center-screen-layout";

const Result = () => {
  const { attemptId } = useParams();
  const { result, isError, message } = useSelector((state) => state.result);

  const dispatch = useDispatch();

  useEffect(() => {
    if (isError) toast.error(message);

    return () => dispatch(resetResultCommonState());
  }, [dispatch, isError, message]);

  useEffect(() => {
    dispatch(getAttemptResult(attemptId));

    return () => dispatch(resetResultCommonState());
  }, [attemptId, dispatch]);

  const percentage =
    result?.score > result?.total_marks || result?.score <= 0
      ? 0
      : ((result?.score / result?.total_marks) * 100).toFixed(2);

  return (
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
            background: "#fff",
          }}
        >
          <Container component="main" maxWidth="xs">
            <Box
              sx={{
                py: { md: 5, xs: 3 },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="h4" sx={{ textAlign: "center", mb: 3 }}>
                Quiz Result
              </Typography>

              <ResultCardItem
                title="Total Questions"
                count={result?.total_questions}
              />

              <ResultCardItem
                title="Total Correct Answer"
                count={result?.correct_answers}
              />

              <ResultCardItem title="Your Score" count={result?.score} />

              <ResultCardItem title="Total Marks" count={result?.total_marks} />

              <ResultCardItem title="Percentage" count={`${percentage}%`} />

              <Typography
                variant="body1"
                sx={{
                  textAlign: "center",
                  mt: 2,
                  color: percentage >= 80 ? "green" : "red",
                }}
              >
                {percentage >= 80
                  ? "Congratulations! You passed the quiz."
                  : "You can do better, next time. Retake the quiz once if you want. 80% is the pass number."}
              </Typography>
            </Box>
          </Container>
        </Box>
      </CenterScreenLayout>
    </Box>
  );
};

const ResultCardItem = ({ title, count }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      my: 0.5,
      width: "100%",
    }}
  >
    <Typography variant="body1" color="textSecondary">
      {title}
    </Typography>

    <Chip
      sx={{
        background: "#000",
        color: "#fff",
        fontWeight: "bold",
        "&:hover": {
          background: "#fff",
          color: "#000",
        },
      }}
      size="small"
      label={count}
    />
  </Box>
);

ResultCardItem.propTypes = {
  count: PropTypes.string,
  title: PropTypes.string,
};

export default Result;
