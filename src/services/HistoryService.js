import api from "./Api";

const getTotalIncome = async () => {
  const url = "/history/getTotalIncome";
  try {
    const response = await api.get(url);
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error("Error:", error);
    return Promise.reject(error);
  }
};

const getTotalOutcome = async () => {
  const url = "/history/getTotalOutcome";
  try {
    const response = await api.get(url); 
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error("Error:", error);
    return Promise.reject(error);
  }
};

const getAllHistory = async () => {
  const url = "/history";
  try {
    const response = await api.get(url); 
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error("Error:", error);
    return Promise.reject(error);
  }
};

const getAllHistoryWithIdKeluarga = async (idKeluarga) => {
  const url = `/history?idKeluarga=${idKeluarga}`;
  try {
    const response = await api.get(url); 
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error("Error:", error);
    return Promise.reject(error);
  }
};

const getDetailHistory = async (id) => {
  const url = `/history/${id}`;
  try {
    const response = await api.get(url); 
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error("Error:", error);
    return Promise.reject(error);
  }
};

const addHistory = async (data) => {
  const url = "/history/add";
  try {
    const response = await api.post(url, data); 
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error("Error:", error);
    return Promise.reject(error);
  }
};

export default {
  getTotalIncome,
  getTotalOutcome,
  getAllHistory,
  getDetailHistory,
  addHistory,
  getAllHistoryWithIdKeluarga,
};
