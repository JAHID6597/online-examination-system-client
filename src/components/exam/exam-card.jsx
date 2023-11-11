import { Box, Button, Chip, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ExamCard = ({ exam, uniqueAttempts, uniqueUsers }) => {
  const { user } = useSelector((state) => state.user);

  return (
    <Box
      sx={{
        boxShadow:
          "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset",
        background: "#fff",
        px: 2,
        pt: 2,
        my: 1,
        height: "100%",
        textAlign: "center",
        cursor: "pointer",
        "&:hover": {
          background: "#783b3b",
          color: "#fff",
        },
      }}
    >
      <Typography variant="h5" sx={{ mt: 1, mb: 3, fontWeight: "bold" }}>
        {exam?.exam_name}
      </Typography>

      <ExamCardCounterItem
        exam={exam}
        title="Total Questions"
        count={exam?.exams_details?.length}
      />

      <ExamCardCounterItem
        exam={exam}
        title="Total Attempts"
        count={Object.keys(uniqueAttempts?.[exam?.id] || {})?.length}
      />

      <ExamCardCounterItem
        exam={exam}
        title="Unique Candidate Participate"
        count={Object.keys(uniqueUsers?.[exam?.id] || {})?.length}
      />

      {user?.role === "CANDIDATE" ? (
        <Button
          component={Link}
          to={`/exam/panel/${exam.id}`}
          sx={{
            background: "#000",
            color: "#fff",
            px: 3,
            mt: 2,
            borderRadius: 5,
            fontWeight: "bold",
            "&:hover": {
              background: "#fff",
              color: "#000",
            },
          }}
          size="small"
        >
          Start Exam
        </Button>
      ) : (
        ""
      )}
    </Box>
  );
};

ExamCard.propTypes = {
  exam: PropTypes.object,
  uniqueAttempts: PropTypes.obj,
  uniqueUsers: PropTypes.obj,
};

const ExamCardCounterItem = ({ title, count }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      mb: 1,
    }}
  >
    <Typography variant="body2">{title}</Typography>

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

ExamCardCounterItem.propTypes = {
  title: PropTypes.string,
  count: PropTypes.number,
};

export default ExamCard;
