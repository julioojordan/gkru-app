import api from "./Api";

const getAllWilayah = async () => {
  const url = "/wilayah";
  try {
    const response = await api.get(url);
    if(response.data.data){
      return Promise.resolve(response.data.data);
    }else{
      return Promise.resolve([]);
    }
  } catch (error) {
    console.error("Error:", error);
    return Promise.reject(error);
  }
};

const updateWilayah = async (formData) => {
  const body = {
    NamaWilayah: formData.NamaWilayah, 
    KodeWilayah: formData.KodeWilayah
  };
  const url = `/wilayah/${formData.Id}/update`;
  try {
    const response = await api.patch(url, body);
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error("Error:", error);
    return Promise.reject(error);
  }
};

const getTotalWilayah = async () => {
  const url = "/wilayah/getTotal";
  try {
    const response = await api.get(url);
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error("Error:", error);
    return Promise.reject(error);
  }
};

const AddWilayah = async (formData) => {
  const url = "/wilayah/add";
  try {
    const response = await api.post(url, formData);
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error("Error:", error);
    return Promise.reject(error);
  }
};

export default {
  getAllWilayah,
  updateWilayah,
  getTotalWilayah,
  AddWilayah
};
