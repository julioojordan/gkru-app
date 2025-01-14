import api from "./Api";

const getTotalWealth = async () => {
  const url = "/wealth/getTotal";
  try {
    const response = await api.get(url);
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error("Error:", error);
    return Promise.reject(error);
  }
};

export default {
  getTotalWealth,
};
