import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { BASE_URL } from "../helper/helper.service";

const BASE_USER_ACCOUNT_URL = `${BASE_URL}/api/v1/user/account`;

const signUp = async (formData) => {
  const { data } = await axios.post(
    `${BASE_USER_ACCOUNT_URL}/registration`,
    formData
  );

  return data;
};

const signIn = async (formData) => {
  const { data } = await axios.post(`${BASE_USER_ACCOUNT_URL}/login`, formData);

  const loginData = data?.data;
  if (loginData) {
    const { access_token, user } = loginData;
    if (access_token) {
      localStorage.setItem("token", JSON.stringify(access_token));
    }
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }

  return data;
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  return true;
};

const isLogin = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  if (!token) return false;

  const decodedToken = jwtDecode(token);
  const isTokenExpired = Date.now() >= decodedToken.exp * 1000;

  return token && !isTokenExpired;
};

const userService = {
  signUp,
  signIn,
  logout,
  isLogin,
};

export default userService;
