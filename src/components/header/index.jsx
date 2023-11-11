import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout, resetUserCommonState } from "../../features/user/user.slice";

const Header = () => {
  const { user, isActionSuccess } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && isActionSuccess) {
      navigate("/signin", { replace: true });
    }

    return () => dispatch(resetUserCommonState());
  }, [dispatch, isActionSuccess, navigate, user]);

  const handleLogOut = () => {
    dispatch(logout());
  };

  return (
    <AppBar position="static" sx={{ background: "#fff" }}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ flexGrow: 1, textDecoration: "none" }}
        >
          Online Examination System
        </Typography>
        {user ? (
          <>
            {user.role === "EXAMINER" ? (
              <Button component={Link} to="/question/all">
                Questions
              </Button>
            ) : (
              ""
            )}

            {user.role === "EXAMINER" ? (
              <Button component={Link} to="/exam/all">
                Exams
              </Button>
            ) : (
              ""
            )}

            <Button component={Link} to="/" onClick={handleLogOut}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button component={Link} to="/signin">
              Sign In
            </Button>
            <Button component={Link} to="/signup">
              Sign Up
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
