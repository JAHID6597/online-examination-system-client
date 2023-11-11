import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import userService from "../features/user/user.service";

const AuthorizedRoute = ({ children }) => {
  const isAuthorized = userService.isLogin();

  return isAuthorized ? children : <Navigate to="/signin" />;
};

AuthorizedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthorizedRoute;
