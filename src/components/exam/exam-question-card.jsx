import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";

const ExamQuestionCard = ({ exam_details, selected, handleSelectAnswer }) => {
  const optionBgColor = {
    selected: {
      backgroundImage: "linear-gradient(120deg, #169d43 0%, #00dd4e 100%)",
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
        width: "100%",
        height: "100%",
        mb: 5,
      }}
    >
      <Typography
        variant="h5"
        sx={{ mt: 1, fontWeight: "bold", textAlign: "center" }}
      >
        Q: {exam_details?.question?.title}
      </Typography>

      {exam_details?.question?.type === "MULTIPLE_CHOICE" ? (
        <Typography variant="body" sx={{ color: "gray", fontSize: 13 }}>
          * Select multiple if multiple answers exists
        </Typography>
      ) : (
        ""
      )}

      <Box sx={{ mt: 5 }}>
        {exam_details?.question?.options?.length &&
          exam_details.question.options.map((option) => (
            <Box
              key={`option-in-exam-card-${option.id}`}
              sx={{
                ...optionBgColor[
                  selected?.[exam_details?.question.id]?.[option.id]
                    ? "selected"
                    : "normal"
                ],
                p: 1.5,
                mb: 2,
                cursor: "pointer",
              }}
              borderRadius={10}
              onClick={() => handleSelectAnswer(exam_details, option.id)}
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

ExamQuestionCard.propTypes = {
  exam_details: PropTypes.object,
  selected: PropTypes.object,
  handleSelectAnswer: PropTypes.func,
};

export default ExamQuestionCard;
