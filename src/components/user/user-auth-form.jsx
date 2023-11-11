import { Person, Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  resetUserCommonState,
  signIn,
  signUp,
} from "../../features/user/user.slice";
import CenterScreenLayout from "../../layout/center-screen-layout";
import FullBackdrop from "../common/full-backdrop";

const UserAuthForm = ({ isSignUp }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isError, message, isLoading, isActionSuccess } = useSelector(
    (state) => state.user
  );
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "CANDIDATE",
  });

  useEffect(() => {
    if (isError) toast.error(message);

    return () => dispatch(resetUserCommonState());
  }, [dispatch, isError, message]);

  const switchMode = useCallback(
    (url) => {
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "CANDIDATE",
      });
      setShowPassword(false);
      setShowConfirmPassword(false);

      navigate(url, { replace: true });
    },
    [navigate]
  );

  useEffect(() => {
    if (isActionSuccess) {
      if (isSignUp) {
        switchMode("/signin");
      } else {
        navigate("/", { replace: true });
      }
    }

    return () => dispatch(resetUserCommonState());
  }, [dispatch, isActionSuccess, isSignUp, navigate, switchMode]);

  const handleShowPassword = () =>
    setShowPassword((showPassword) => !showPassword);

  const handleShowConfirmPassword = () =>
    setShowConfirmPassword((showConfirmPassword) => !showConfirmPassword);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignUp) {
      dispatch(
        signUp({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        })
      );
    } else {
      dispatch(
        signIn({ username: formData.username, password: formData.password })
      );
    }
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
              boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
              background: "#fff",
            }}
          >
            <Container component="main" maxWidth="xs">
              <Box
                sx={{
                  py: { md: 5, xs: 3 },
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                  <Person />
                </Avatar>
                <Typography
                  component="h1"
                  variant="h4"
                  sx={{ textTransform: "uppercase" }}
                >
                  {isSignUp ? "Sign up" : "Sign in"}
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
                          name="username"
                          fullWidth
                          label="User Name"
                          value={formData.username}
                          onChange={(e) => handleChange(e)}
                          required
                        />
                      </Grid>

                      {isSignUp && (
                        <Grid item xs={12}>
                          <TextField
                            name="email"
                            type="email"
                            fullWidth
                            label="Email"
                            value={formData.email}
                            onChange={(e) => handleChange(e)}
                            required
                          />
                        </Grid>
                      )}

                      <Grid item xs={12}>
                        <TextField
                          required
                          fullWidth
                          name="password"
                          label="Password"
                          type={showPassword ? "text" : "password"}
                          id="password"
                          value={formData.password}
                          onChange={(e) => handleChange(e)}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleShowPassword}
                                  edge="end"
                                >
                                  {showPassword ? (
                                    <Visibility />
                                  ) : (
                                    <VisibilityOff />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>

                      {isSignUp && (
                        <Grid item xs={12}>
                          <TextField
                            required
                            fullWidth
                            name="confirmPassword"
                            label="Confirm Password"
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={(e) => handleChange(e)}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleShowConfirmPassword}
                                    edge="end"
                                  >
                                    {showConfirmPassword ? (
                                      <Visibility />
                                    ) : (
                                      <VisibilityOff />
                                    )}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                      )}
                    </Grid>

                    {isSignUp && (
                      <Grid item xs={12}>
                        <FormControl component="fieldset">
                          <Typography sx={{ mt: 1.5, color: "#000" }}>
                            Register As A
                          </Typography>

                          <RadioGroup
                            row
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                          >
                            <FormControlLabel
                              value="EXAMINER"
                              control={<Radio />}
                              label="Examiner"
                            />
                            <FormControlLabel
                              value="CANDIDATE"
                              control={<Radio />}
                              label="Candidate"
                            />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                    )}

                    <Button
                      size="large"
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ my: 2 }}
                    >
                      {isSignUp ? "Sign Up" : "Sign In"}
                    </Button>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Typography>
                        {isSignUp ? (
                          <Typography variant="body">
                            Already have an account?
                            <Typography
                              variant="body"
                              sx={{
                                color: "#551A8B",
                                ml: 1,
                                cursor: "pointer",
                              }}
                              onClick={() => switchMode("/signin")}
                            >
                              Sign in
                            </Typography>
                          </Typography>
                        ) : (
                          <Typography variant="body">
                            Do not have an account?
                            <Typography
                              variant="body"
                              sx={{
                                color: "#551A8B",
                                ml: 1,
                                cursor: "pointer",
                              }}
                              onClick={() => switchMode("/signup")}
                            >
                              Sign Up
                            </Typography>
                          </Typography>
                        )}
                      </Typography>
                    </Box>
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

UserAuthForm.propTypes = {
  isSignUp: PropTypes.bool.isRequired,
};

export default UserAuthForm;
