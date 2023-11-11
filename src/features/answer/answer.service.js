import axios from "axios";
import { BASE_URL, config } from "../helper/helper.service";

const BASE_ANSWER_URL = `${BASE_URL}/api/v1/answer`;

const create = async (formData) => {
  const { data } = await axios.post(
    `${BASE_ANSWER_URL}/create`,
    formData,
    config()
  );

  return data?.data;
};

const getAllByParticipant = async () => {
  const { data } = await axios.get(
    `${BASE_ANSWER_URL}/all-by-participant`,
    config()
  );

  return data?.data;
};

const answerService = {
  create,
  getAllByParticipant,
};

export default answerService;
