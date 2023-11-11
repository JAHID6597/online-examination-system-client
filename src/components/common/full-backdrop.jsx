import { Backdrop, CircularProgress } from "@mui/material";
import PropTypes from "prop-types";

const FullBackdrop = ({ isOpenBackDrop }) => {
  return (
    <Backdrop sx={{ color: "#fff", zIndex: 5000 }} open={isOpenBackDrop}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

FullBackdrop.propTypes = {
  isOpenBackDrop: PropTypes.bool.isRequired,
};

export default FullBackdrop;
