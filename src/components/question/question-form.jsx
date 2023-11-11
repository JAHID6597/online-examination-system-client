import { Add, Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  createQuestion,
  resetQuestionCommonState,
} from "../../features/question/question.slice";
import CenterScreenLayout from "../../layout/center-screen-layout";
import FullBackdrop from "../common/full-backdrop";

const QuestionForm = () => {
  const dispatch = useDispatch();

  const { isError, message, isLoading, isActionSuccess } = useSelector(
    (state) => state.question
  );

  const [formData, setFormData] = useState({
    title: "",
    type: "SINGLE_CHOICE",
    options: [{ title: "", is_correct: false }],
  });

  useEffect(() => {
    if (isActionSuccess) {
      setFormData({
        title: "",
        type: "SINGLE_CHOICE",
        options: [{ title: "", is_correct: false }],
      });
    }

    return () => dispatch(resetQuestionCommonState());
  }, [dispatch, isActionSuccess]);

  useEffect(() => {
    if (isError) toast.error(message);

    return () => dispatch(resetQuestionCommonState());
  }, [dispatch, isError, message]);

  const handleChange = (field, value) =>
    setFormData({ ...formData, [field]: value });

  const handleOptionChange = (index, field, value) => {
    const options = [...formData.options];
    if (field === "title") {
      options[index].title = value;
    } else if (field === "is_correct") {
      options[index].is_correct = value;
    }
    setFormData({ ...formData, options: options });
  };

  const handleAddOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, { title: "", is_correct: false }],
    });
  };

  const handleDeleteOption = (index) => {
    const newOptions = [...formData.options];
    newOptions.splice(index, 1);
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(createQuestion(formData));
  };

  return (
    <>
      {isLoading && <FullBackdrop isOpenBackDrop={isLoading} />}

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
            <Container component="main" maxWidth="sm">
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
                  Add New Question
                </Typography>
                <Box
                  component="form"
                  autoComplete="off"
                  onSubmit={handleSubmit}
                >
                  <Box sx={{ mt: { md: 5, xs: 3 } }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          name="title"
                          fullWidth
                          label="Question"
                          value={formData.title}
                          onChange={(e) =>
                            handleChange("title", e.target.value)
                          }
                          required
                        />

                        <FormControl fullWidth sx={{ mt: 2 }}>
                          <InputLabel id="answer-type-select-label">
                            Answer Selection Type
                          </InputLabel>
                          <Select
                            labelId="answer-type-select-label"
                            label="Answer Selection Type"
                            value={formData.type}
                            onChange={(e) =>
                              handleChange("type", e.target.value)
                            }
                            required
                          >
                            <MenuItem value="SINGLE_CHOICE">SINGLE</MenuItem>
                            <MenuItem value="MULTIPLE_CHOICE">
                              MULTIPLE
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12}>
                        <Box>
                          {formData?.options?.map((option, index) => (
                            <Box
                              key={index}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: "8px",
                              }}
                            >
                              <TextField
                                label={`Option ${index + 1}`}
                                value={option.title}
                                onChange={(e) =>
                                  handleOptionChange(
                                    index,
                                    "title",
                                    e.target.value
                                  )
                                }
                                sx={{ flex: 1, marginRight: "8px" }}
                                required
                              />

                              <FormControl>
                                <InputLabel id="correct-type-select-label">
                                  Correct
                                </InputLabel>
                                <Select
                                  labelId="correct-type-select-label"
                                  label="Correct"
                                  value={option.is_correct}
                                  onChange={(e) =>
                                    handleOptionChange(
                                      index,
                                      "is_correct",
                                      e.target.value
                                    )
                                  }
                                >
                                  <MenuItem value={false}>No</MenuItem>
                                  <MenuItem value={true}>Yes</MenuItem>
                                </Select>
                              </FormControl>
                              {formData?.options?.length > 1 && (
                                <IconButton
                                  onClick={() => handleDeleteOption(index)}
                                >
                                  <Delete />
                                </IconButton>
                              )}
                            </Box>
                          ))}
                          <Grid container justifyContent="center">
                            <IconButton onClick={handleAddOption}>
                              <Add />
                            </IconButton>
                          </Grid>
                        </Box>
                      </Grid>
                    </Grid>

                    <Button
                      size="large"
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ my: 2 }}
                    >
                      Add New Question
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Container>
          </Box>
        </CenterScreenLayout>
      </Box>
    </>
  );
};

export default QuestionForm;
