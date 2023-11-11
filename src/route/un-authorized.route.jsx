import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import userService from "../features/user/user.service";

const UnAuthorizedRoute = ({ children }) => {
  const isAuthorized = userService.isLogin();

  return isAuthorized ? <Navigate to="/" /> : children;
};

UnAuthorizedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UnAuthorizedRoute;
