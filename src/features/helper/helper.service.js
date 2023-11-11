export const BASE_URL = import.meta.env.VITE_APP_SERVER_URL;

export const config = () => {
  const token = localStorage.getItem("token") || null;
  const parsedToken = JSON.parse(token);

  return {
    headers: {
      Authorization: `Bearer ${parsedToken}`,
    },
  };
};
