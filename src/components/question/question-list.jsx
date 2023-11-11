import { Box, Button, Container, Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  getAllQuestion,
  resetQuestionCommonState,
} from "../../features/question/question.slice";
import CenterScreenLayout from "../../layout/center-screen-layout";
import QuestionCard from "./question-card";
import { Link } from "react-router-dom";

const QuestionList = () => {
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { questions, isError, message, isSuccess } = useSelector(
    (state) => state.question
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const filtered = questions.filter((question) =>
      question.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setRows(filtered);
  }, [questions, searchTerm]);

  useEffect(() => {
    if (isSuccess) setRows(questions);

    return () => dispatch(resetQuestionCommonState());
  }, [dispatch, isSuccess, questions]);

  useEffect(() => {
    if (isError) toast.error(message);

    return () => dispatch(resetQuestionCommonState());
  }, [dispatch, isError, message]);

  useEffect(() => {
    dispatch(getAllQuestion());

    return () => dispatch(resetQuestionCommonState());
  }, [dispatch]);

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
            sx={{ m: 0, background: "#fff", p: 2 }}
            alignItems="center"
          >
            <Grid item md={8} xs={12}>
              <TextField
                label="Search Question"
                variant="outlined"
                fullWidth
                placeholder="Search Question..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Grid>
            <Grid item md={4} xs={12} sx={{ textAlign: "end" }}>
              <Button
                component={Link}
                to="/question/add-new"
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

          <Grid container spacing={2}>
            {rows?.length &&
              rows?.map((row) => (
                <Grid
                  key={`question-ans-option-card-${row.id}`}
                  item
                  md={6}
                  xs={12}
                >
                  <QuestionCard question={row} />
                </Grid>
              ))}
          </Grid>
        </Container>
      </CenterScreenLayout>
    </Box>
  );
};

export default QuestionList;
