import axios from "axios";
import { BASE_URL, config } from "../helper/helper.service";

const BASE_RESULT_URL = `${BASE_URL}/api/v1/result`;

const getAttemptResult = async (attemptId) => {
  const { data } = await axios.get(
    `${BASE_RESULT_URL}/attempted-exam-result/${attemptId}`,
    config()
  );

  return data?.data;
};

const getAllResult = async () => {
  const { data } = await axios.get(`${BASE_RESULT_URL}/all`);

  return data?.data;
};

const resultService = {
  getAttemptResult,
  getAllResult,
};

export default resultService;
