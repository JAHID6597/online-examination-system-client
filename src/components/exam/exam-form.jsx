import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  createExam,
  resetExamCommonState,
} from "../../features/exam/exam.slice";
import {
  getAllQuestion,
  resetQuestionCommonState,
} from "../../features/question/question.slice";
import CenterScreenLayout from "../../layout/center-screen-layout";
import QuestionSelectCard from "../question/question-select-card";

const ExamForm = () => {
  const [formData, setFormData] = useState({
    exam_name: "",
    is_negative_mark_applicable: "NO",
    positive_mark_type: "QUESTION_WISE",
    positive_marks: 0,
    negative_mark_type: "QUESTION_WISE",
    negative_marks: 0,
    exam_duration_type: "QUESTION_WISE",
    total_hours: 0,
    total_mins: 0,
    selected_questions: [],
  });

  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    questions,
    isError: isQuestionError,
    message: questionMessage,
    isSuccess: isQuestionSuccess,
  } = useSelector((state) => state.question);
  const {
    isError: isExamError,
    message: examMessage,
    isActionSuccess: isExamActionSuccess,
  } = useSelector((state) => state.exam);
  const dispatch = useDispatch();

  useEffect(() => {
    const filtered = questions.filter((questions) =>
      questions.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setRows(filtered);
  }, [questions, searchTerm]);

  useEffect(() => {
    if (isQuestionSuccess) {
      setRows(questions);
      setFormData({
        ...formData,
        selected_questions: questions?.map((question) => ({
          id: question.id,
          selected: false,
          positive_marks: 0,
          negative_marks: 0,
          total_hours: 0,
          total_mins: 0,
        })),
      });
    }

    return () => dispatch(resetQuestionCommonState());
  }, [dispatch, formData, isQuestionSuccess, questions]);

  useEffect(() => {
    if (isQuestionError) toast.error(questionMessage);

    return () => dispatch(resetQuestionCommonState());
  }, [dispatch, isQuestionError, questionMessage]);

  useEffect(() => {
    if (isExamError) toast.error(examMessage);

    return () => dispatch(resetExamCommonState());
  }, [dispatch, examMessage, isExamError]);

  useEffect(() => {
    if (isExamActionSuccess) {
      toast.success("Successfully added a new exam.");
      setFormData({
        exam_name: "",
        is_negative_mark_applicable: "NO",
        positive_mark_type: "QUESTION_WISE",
        positive_marks: 0,
        negative_mark_type: "QUESTION_WISE",
        negative_marks: 0,
        exam_duration_type: "QUESTION_WISE",
        total_hours: 0,
        total_mins: 0,
        selected_questions: questions?.map((question) => ({
          id: question.id,
          selected: false,
          positive_marks: 0,
          negative_marks: 0,
          total_hours: 0,
          total_mins: 0,
        })),
      });
    }

    return () => dispatch(resetExamCommonState());
  }, [dispatch, isExamActionSuccess, questions]);

  useEffect(() => {
    dispatch(getAllQuestion());

    return () => dispatch(resetQuestionCommonState());
  }, [dispatch]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedQuestions = formData.selected_questions.filter(
      (item) => item.selected
    );

    const body = {
      exam_name: formData.exam_name,
      exam_duration_type: formData.exam_duration_type,
      duration: (formData.exam_duration_type === "FULL_EXAM"
        ? +formData.total_hours * 3600 + +formData.total_mins * 60
        : 0
      ).toString(),
      selected_questions: selectedQuestions.map((item) => ({
        question_id: item.id,
        positive_marks:
          formData.positive_mark_type === "FULL_EXAM"
            ? +formData.positive_marks
            : +item.positive_marks,
        negative_marks:
          formData.negative_mark_type === "FULL_EXAM"
            ? +formData.negative_marks
            : +item.negative_marks,
        duration: (
          (formData.exam_duration_type === "FULL_EXAM"
            ? +formData.total_hours * 3600 + +formData.total_mins * 60
            : +item.total_hours * 3600 + +item.total_mins * 60) /
          selectedQuestions?.length
        ).toString(),
      })),
    };
    if (!body?.selected_questions?.length) {
      toast.warning("Select at least 1 question to create a exam.");
    } else dispatch(createExam(body));
  };

  const handleSelectQuestion = (question, key, value) => {
    const selectedQuestions = [...formData.selected_questions].map((item) => {
      if (item.id === question.id) item[key] = value;
      return item;
    });

    setFormData({
      ...formData,
      selected_questions: selectedQuestions,
    });
  };

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
            background: "#EAEDED",
          }}
        >
          <Container component="main">
            <Box
              sx={{
                py: { md: 5, xs: 3 },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography
                component="h1"
                variant="h4"
                sx={{ textTransform: "uppercase", fontWeight: "bold" }}
              >
                Add New Exam
              </Typography>

              <Box component="form" autoComplete="off" onSubmit={handleSubmit}>
                <Box sx={{ mt: { md: 5, xs: 3 } }}>
                  <Box
                    sx={{
                      boxShadow:
                        "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset",
                      p: 2,
                      mb: 4,
                      background: "#fff",
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          name="exam_name"
                          fullWidth
                          label="Exam name"
                          value={formData.exam_name}
                          onChange={handleChange}
                          required
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <FormControl component="fieldset">
                          <Typography
                            sx={{
                              mt: 1.5,
                              color: "#000",
                              fontWeight: "bold",
                            }}
                          >
                            Positive Mark Type
                          </Typography>

                          <RadioGroup
                            row
                            name="positive_mark_type"
                            value={formData.positive_mark_type}
                            onChange={handleChange}
                          >
                            <FormControlLabel
                              value="FULL_EXAM"
                              control={<Radio />}
                              label="Same For Full Exam"
                            />
                            <FormControlLabel
                              value="QUESTION_WISE"
                              control={<Radio />}
                              label="Question Wise"
                            />
                          </RadioGroup>
                        </FormControl>
                      </Grid>

                      {formData?.positive_mark_type === "FULL_EXAM" && (
                        <Grid item xs={12}>
                          <TextField
                            name="positive_marks"
                            type="number"
                            fullWidth
                            label="Positive Marks For Each Question"
                            value={formData.positive_marks}
                            onChange={handleChange}
                            required
                            sx={{ mt: 1.5 }}
                            InputProps={{ inputProps: { min: 0 } }}
                          />
                        </Grid>
                      )}

                      <Grid item xs={12}>
                        <FormControl component="fieldset">
                          <Typography
                            sx={{ mt: 1.5, color: "#000", fontWeight: "bold" }}
                          >
                            Does Negative Mark Applicable For This Exam?
                          </Typography>

                          <RadioGroup
                            row
                            name="is_negative_mark_applicable"
                            value={formData.is_negative_mark_applicable}
                            onChange={handleChange}
                          >
                            <FormControlLabel
                              value="YES"
                              control={<Radio />}
                              label="Yes"
                            />
                            <FormControlLabel
                              value="NO"
                              control={<Radio />}
                              label="No"
                            />
                          </RadioGroup>
                        </FormControl>
                      </Grid>

                      {formData?.is_negative_mark_applicable === "YES" && (
                        <Grid item xs={12}>
                          <FormControl component="fieldset">
                            <Typography
                              sx={{
                                mt: 1.5,
                                color: "#000",
                                fontWeight: "bold",
                              }}
                            >
                              Negative Mark Type
                            </Typography>

                            <RadioGroup
                              row
                              name="negative_mark_type"
                              value={formData.negative_mark_type}
                              onChange={handleChange}
                            >
                              <FormControlLabel
                                value="FULL_EXAM"
                                control={<Radio />}
                                label="Same For Full Exam"
                              />
                              <FormControlLabel
                                value="QUESTION_WISE"
                                control={<Radio />}
                                label="Question Wise"
                              />
                            </RadioGroup>
                          </FormControl>
                        </Grid>
                      )}

                      {formData?.is_negative_mark_applicable === "YES" &&
                        formData?.negative_mark_type === "FULL_EXAM" && (
                          <Grid item xs={12}>
                            <TextField
                              name="negative_marks"
                              type="number"
                              fullWidth
                              label="Negative Marks For Each Question"
                              value={formData.negative_marks}
                              onChange={handleChange}
                              required
                              sx={{ mt: 1.5 }}
                              InputProps={{ inputProps: { min: 0 } }}
                            />
                          </Grid>
                        )}

                      <Grid item xs={12}>
                        <FormControl component="fieldset">
                          <Typography
                            sx={{ mt: 1.5, color: "#000", fontWeight: "bold" }}
                          >
                            Exam Duration Type
                          </Typography>

                          <RadioGroup
                            row
                            name="exam_duration_type"
                            value={formData.exam_duration_type}
                            onChange={handleChange}
                          >
                            <FormControlLabel
                              value="FULL_EXAM"
                              control={<Radio />}
                              label="Same For Full Exam"
                            />
                            <FormControlLabel
                              value="QUESTION_WISE"
                              control={<Radio />}
                              label="Question Wise"
                            />
                          </RadioGroup>
                        </FormControl>
                      </Grid>

                      {formData?.exam_duration_type === "FULL_EXAM" && (
                        <>
                          <Grid item xs={6}>
                            <TextField
                              name="total_hours"
                              type="number"
                              fullWidth
                              label="Total Hours"
                              value={formData.total_hours}
                              onChange={handleChange}
                              required
                              sx={{ mt: 1.5 }}
                              InputProps={{ inputProps: { min: 0 } }}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              name="total_mins"
                              type="number"
                              fullWidth
                              label="Total Mins"
                              value={formData.total_mins}
                              onChange={handleChange}
                              required
                              sx={{ mt: 1.5 }}
                              InputProps={{ inputProps: { min: 0 } }}
                            />
                          </Grid>
                        </>
                      )}
                    </Grid>
                  </Box>

                  <Box
                    sx={{
                      boxShadow:
                        "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset",
                      p: 2,
                      background: "#fff",
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography
                          sx={{ mb: 1.5, color: "#000", fontWeight: "bold" }}
                        >
                          Select Questions
                        </Typography>

                        <TextField
                          label="Search Question"
                          variant="outlined"
                          fullWidth
                          placeholder="Search Question..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          sx={{ mb: 3 }}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      {rows?.length
                        ? rows?.map((row) => (
                            <Grid
                              key={`question-select-in-card-${row.id}`}
                              item
                              md={4}
                              xs={12}
                            >
                              <QuestionSelectCard
                                question={row}
                                formData={formData}
                                handleSelectQuestion={handleSelectQuestion}
                              />
                            </Grid>
                          ))
                        : ""}
                    </Grid>
                  </Box>
                </Box>

                <Box sx={{ mt: 3, textAlign: "center" }}>
                  <Button size="large" type="submit" variant="contained">
                    Add New Exam
                  </Button>
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>
      </CenterScreenLayout>
    </Box>
  );
};

export default ExamForm;
