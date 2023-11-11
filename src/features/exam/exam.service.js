import axios from "axios";
import { BASE_URL, config } from "../helper/helper.service";

const BASE_EXAM_URL = `${BASE_URL}/api/v1/exam`;

const create = async (formData) => {
  const { data } = await axios.post(
    `${BASE_EXAM_URL}/create`,
    formData,
    config()
  );

  return data?.data;
};

const getAll = async () => {
  const { data } = await axios.get(`${BASE_EXAM_URL}/all`);

  return data?.data;
};

const getAllByCreator = async () => {
  const { data } = await axios.get(`${BASE_EXAM_URL}/all-by-creator`, config());

  return data?.data;
};

const getDetails = async (id) => {
  const { data } = await axios.get(`${BASE_EXAM_URL}/details/${id}`, config());

  return data?.data;
};

const examService = {
  create,
  getAll,
  getAllByCreator,
  getDetails,
};

export default examService;
