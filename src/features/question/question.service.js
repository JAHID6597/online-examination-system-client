import axios from "axios";
import { BASE_URL, config } from "../helper/helper.service";

const BASE_QUESTION_URL = `${BASE_URL}/api/v1/question`;

const create = async (formData) => {
  const { data } = await axios.post(
    `${BASE_QUESTION_URL}/create`,
    formData,
    config()
  );

  return data?.data;
};

const getAll = async () => {
  const { data } = await axios.get(`${BASE_QUESTION_URL}/all`, config());

  return data?.data;
};

const questionService = {
  create,
  getAll,
};

export default questionService;
