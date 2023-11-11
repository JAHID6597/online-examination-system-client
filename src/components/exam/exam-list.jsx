import { Box, Button, Container, Grid, TextField } from "@mui/material";
import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getAllExamByCreator,
  resetExamCommonState,
} from "../../features/exam/exam.slice";
import {
  getAllResult,
  resetResultCommonState,
} from "../../features/result/result.slice";
import CenterScreenLayout from "../../layout/center-screen-layout";
import ExamCard from "./exam-card";

const ExamList = () => {
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { exams, isError, message, isSuccess } = useSelector(
    (state) => state.exam
  );
  const {
    results,
    isError: isResultError,
    message: resultMessage,
    isSuccess: isResultSuccess,
  } = useSelector((state) => state.result);
  const dispatch = useDispatch();

  const [uniqueAttempts, setUniqueAttempts] = useState(0);
  const [uniqueUsers, setUniqueUsers] = useState(0);

  useEffect(() => {
    const filtered = exams.filter((exam) =>
      exam.exam_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setRows(filtered);
  }, [exams, searchTerm]);

  useEffect(() => {
    if (isSuccess) {
      setRows(exams);
    }

    return () => dispatch(resetExamCommonState());
  }, [dispatch, exams, isSuccess]);

  useEffect(() => {
    if (isError) toast.error(message);

    return () => dispatch(resetExamCommonState());
  }, [dispatch, isError, message]);

  const getUniqueData = useCallback(() => {
    if (!results?.length) return;

    const uniqueAttemptsData = {};
    const uniqueUsersData = {};

    results.forEach((r) => {
      if (!uniqueAttemptsData[r.exam_id]) uniqueAttemptsData[r.exam_id] = {};
      if (!uniqueAttemptsData[r.exam_id][r.attempt_id])
        uniqueAttemptsData[r.exam_id][r.attempt_id] = 1;

      if (!uniqueUsersData[r.exam_id]) uniqueUsersData[r.exam_id] = {};
      if (!uniqueUsersData[r.exam_id][r.candidate_id])
        uniqueUsersData[r.exam_id][r.candidate_id] = 1;
    });

    setUniqueAttempts(uniqueAttemptsData);
    setUniqueUsers(uniqueUsersData);
  }, [results]);

  useEffect(() => {
    if (isResultSuccess) {
      getUniqueData();
    }

    return () => dispatch(resetResultCommonState());
  }, [dispatch, getUniqueData, isResultSuccess]);

  useEffect(() => {
    if (isResultError) toast.error(resultMessage);

    return () => dispatch(resetResultCommonState());
  }, [dispatch, isResultError, resultMessage]);

  useEffect(() => {
    dispatch(getAllResult());

    return () => dispatch(resetResultCommonState());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllExamByCreator());

    return () => dispatch(resetExamCommonState());
  }, [dispatch]);

  return (
    <ExamListDetails
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      rows={rows}
      uniqueAttempts={uniqueAttempts}
      uniqueUsers={uniqueUsers}
    />
  );
};

export default ExamList;

export function ExamListDetails({
  searchTerm,
  setSearchTerm,
  rows,
  uniqueAttempts,
  uniqueUsers,
}) {
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
        <Container component="main">
          <Grid
            container
            sx={{
              m: 0,
              background: "#fff",
              p: 2,
            }}
            alignItems="center"
          >
            <Grid item md={8} xs={12}>
              <TextField
                label="Search Exam"
                variant="outlined"
                fullWidth
                placeholder="Search Exam..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Grid>
            <Grid
              item
              md={4}
              xs={12}
              sx={{
                textAlign: "end",
              }}
            >
              <Button
                component={Link}
                to="/exam/add-new"
                sx={{
                  background: "#000",
                  color: "#fff",
                  px: 3,
                  "&:hover": {
                    background: "#000",
                    color: "#fff",
                  },
                }}
                size="large"
              >
                Add New
              </Button>
            </Grid>
          </Grid>

          <Grid container spacing={1}>
            {rows?.length &&
              rows?.map((row) => (
                <Grid key={`exams-card-${row.id}`} item md={3} sm={6} xs={12}>
                  <ExamCard
                    exam={row}
                    uniqueAttempts={uniqueAttempts}
                    uniqueUsers={uniqueUsers}
                  />
                </Grid>
              ))}
          </Grid>
        </Container>
      </CenterScreenLayout>
    </Box>
  );
}

ExamListDetails.propTypes = {
  rows: PropTypes.array,
  searchTerm: PropTypes.string,
  setSearchTerm: PropTypes.func,
  uniqueAttempts: PropTypes.obj,
  uniqueUsers: PropTypes.obj,
};
