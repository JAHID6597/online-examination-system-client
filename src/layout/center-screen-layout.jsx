import { Box } from "@mui/material";
import PropTypes from "prop-types";

const CenterScreenLayout = ({ height, children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: height || { md: "80vh", xs: "90vh" },
        p: { sm: 1, md: 2 }
      }}
    >
      {children}
    </Box>
  );
};

CenterScreenLayout.propTypes = {
  children: PropTypes.node.isRequired,
  height: PropTypes.any,
};

export default CenterScreenLayout;
