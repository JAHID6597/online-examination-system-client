import axios from "axios";
import { BASE_URL, config } from "../helper/helper.service";

const BASE_OPTION_URL = `${BASE_URL}/api/v1/option`;

const create = async (formData) => {
  const { data } = await axios.post(
    `${BASE_OPTION_URL}/create`,
    formData,
    config()
  );

  return data;
};

const optionService = {
  create,
};

export default optionService;
