import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import userService from "../features/user/user.service";

const ExaminerRoute = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const isAuthorized = userService.isLogin() && user.role === "EXAMINER";

  return isAuthorized ? children : <Navigate to="/signin" />;
};

ExaminerRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ExaminerRoute;
