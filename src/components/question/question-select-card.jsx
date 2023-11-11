import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const QuestionSelectCard = ({ question, formData, handleSelectQuestion }) => {
  const [selectedQuestion, setSelectedQuestion] = useState({});
  useEffect(() => {
    setSelectedQuestion(
      formData.selected_questions.find((i) => i.id === question.id)
    );
  }, [formData.selected_questions, question.id]);

  const optionBgColor = {
    correct: {
      backgroundImage: "linear-gradient(120deg, #169d43 0%, #00dd4e 100%)",
      color: "#fff",
    },
    wrong: {
      backgroundImage:
        "linear-gradient(120deg, #ff0000 0%, #b50000 48%, #951616 100%)",
      color: "#fff",
    },
    normal: {
      backgroundImage:
        "linear-gradient(-225deg, #5D9FFF 0%, #B8DCFF 48%, #6BBBFF 100%)",
      color: "#000",
    },
  };

  const cardBgColor = {
    selected: {
      backgroundImage: "linear-gradient(to right, #43e97b 0%, #38f9d7 100%)",
    },
    normal: {
      background: "#fff",
    },
  };
  const cardBgColorSelector = selectedQuestion?.selected
    ? cardBgColor.selected
    : cardBgColor.normal;

  return (
    <Box
      sx={{
        boxShadow:
          "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset",
        ...cardBgColorSelector,
        px: 2,
        pt: 2,
        height: "100%",
        cursor: "pointer",
      }}
    >
      <FormControlLabel
        control={
          <Checkbox
            checked={selectedQuestion?.selected || false}
            onChange={() =>
              handleSelectQuestion(
                question,
                "selected",
                !selectedQuestion?.selected
              )
            }
            color="success"
          />
        }
        label="Select Question"
        sx={{ mb: 2 }}
      />

      <Grid container spacing={2}>
        {formData?.positive_mark_type === "QUESTION_WISE" && (
          <Grid
            item
            xs={
              formData?.is_negative_mark_applicable === "YES" &&
              formData?.negative_mark_type === "QUESTION_WISE"
                ? 6
                : 12
            }
          >
            <TextField
              name="positive_marks"
              type="number"
              fullWidth
              label="Positive Marks"
              value={selectedQuestion?.positive_marks}
              onChange={(e) =>
                handleSelectQuestion(question, "positive_marks", e.target.value)
              }
              required
              sx={{ mb: 1.5 }}
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>
        )}

        {formData?.is_negative_mark_applicable === "YES" &&
          formData?.negative_mark_type === "QUESTION_WISE" && (
            <Grid
              item
              xs={formData?.positive_mark_type === "QUESTION_WISE" ? 6 : 12}
            >
              <TextField
                name="negative_marks"
                type="number"
                fullWidth
                label="Negative Marks"
                value={selectedQuestion?.negative_marks}
                onChange={(e) =>
                  handleSelectQuestion(
                    question,
                    "negative_marks",
                    e.target.value
                  )
                }
                required
                sx={{ mb: 1.5 }}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
          )}

        {formData?.exam_duration_type === "QUESTION_WISE" && (
          <>
            <Grid item xs={6}>
              <TextField
                name="total_hours"
                type="number"
                fullWidth
                label="Total Hours"
                value={selectedQuestion?.total_hours}
                onChange={(e) =>
                  handleSelectQuestion(question, "total_hours", e.target.value)
                }
                required
                sx={{ mb: 1.5 }}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="total_mins"
                type="number"
                fullWidth
                label="Total Mins"
                value={selectedQuestion?.total_mins}
                onChange={(e) =>
                  handleSelectQuestion(question, "total_mins", e.target.value)
                }
                required
                sx={{ mb: 1.5 }}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
          </>
        )}
      </Grid>

      <Typography
        variant="h5"
        sx={{ my: 1, fontWeight: "bold", textAlign: "center" }}
      >
        Q: {question.title}
      </Typography>

      <Box sx={{ mt: 5 }}>
        {question?.options?.length &&
          question.options.map((option) => (
            <Box
              key={`option-in-card-${option.id}`}
              sx={{
                ...optionBgColor[option?.is_correct ? "correct" : "normal"],
                p: 1.5,
                mb: 2,
              }}
              borderRadius={10}
            >
              <Typography sx={{ textAlign: "center" }}>
                {option.title}
              </Typography>
            </Box>
          ))}
      </Box>
    </Box>
  );
};

QuestionSelectCard.propTypes = {
  question: PropTypes.object,
  formData: PropTypes.object,
  handleSelectQuestion: PropTypes.func,
};

export default QuestionSelectCard;
