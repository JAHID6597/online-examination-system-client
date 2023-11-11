import { Box, Grid, Typography } from "@mui/material";
import PropTypes from "prop-types";

const QuestionCard = ({ question }) => {
  const bgColor = {
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

  return (
    <Box
      sx={{
        boxShadow:
          "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset",
        background: "#fff",
        px: 2,
        pt: 2,
        my: 2,
        height: "100%",
        "&:hover": {
          background: "#000",
          color: "#fff",
        },
      }}
    >
      <Typography
        variant="h5"
        sx={{ my: 1, fontWeight: "bold", textAlign: "center" }}
      >
        Q: {question.title}
      </Typography>

      <Box sx={{ mt: 5 }}>
        <Grid container spacing={2}>
          {question?.options?.length &&
            question.options.map((option) => (
              <Grid key={`option-in-card-${option.id}`} item md={6} xs={12}>
                <Box
                  sx={{
                    ...bgColor[option?.is_correct ? "correct" : "normal"],
                    p: 1.5,
                  }}
                  borderRadius={10}
                >
                  <Typography sx={{ textAlign: "center" }}>
                    {option.title}
                  </Typography>
                </Box>
              </Grid>
            ))}
        </Grid>
      </Box>
    </Box>
  );
};

QuestionCard.propTypes = {
  question: PropTypes.object,
};

export default QuestionCard;
